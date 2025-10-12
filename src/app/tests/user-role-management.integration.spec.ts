/**
 * User Role Management - Integration Verification Tests
 *
 * This test suite verifies:
 * 1. Admin form is only accessible to users with admin role
 * 2. User form can change user roles
 * 3. Role changes update permissions correctly
 */

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { UserFormComponent } from '../components/users/user-form.component';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { AdminGuard } from '../guards/admin.guard';
import { PREDEFINED_ROLES } from '../shared/user';
import { environment } from '../../environments/environment';

describe('User Role Management - Integration Verification', () => {
  let userService: UserService;
  let authService: AuthenticationService;
  let adminGuard: AdminGuard;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        UserFormComponent
      ],
      providers: [
        UserService,
        AuthenticationService,
        AdminGuard,
        {
          provide: Router,
          useValue: {
            navigate: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    });

    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthenticationService);
    adminGuard = TestBed.inject(AdminGuard);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('✅ REQUIREMENT 1: Admin form accessible only to admin users', () => {
    it('should allow admin user to access admin routes', (done) => {
      // Simulate admin login
      const adminUser = {
        _id: '1',
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        permissions: []
      };

      // Set admin auth state
      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      (authService as any).authStateSubject.next({
        isAuthenticated: true,
        user: adminUser,
        token: 'mock-admin-token'
      });

      const route = {} as any;
      const state = { url: '/admin/users' } as any;

      adminGuard.canActivate(route, state).subscribe((canAccess) => {
        expect(canAccess).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });

    it('should deny viewer user access to admin routes', (done) => {
      // Simulate viewer login
      const viewerUser = {
        _id: '2',
        username: 'viewer',
        email: 'viewer@test.com',
        role: 'viewer',
        permissions: []
      };

      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      (authService as any).authStateSubject.next({
        isAuthenticated: true,
        user: viewerUser,
        token: 'mock-viewer-token'
      });

      const route = {} as any;
      const state = { url: '/admin/users' } as any;

      adminGuard.canActivate(route, state).subscribe((canAccess) => {
        expect(canAccess).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/home'], {
          queryParams: { error: 'admin-access-required' }
        });
        done();
      });
    });

    it('should deny regular user access to admin routes', (done) => {
      // Simulate regular user login
      const regularUser = {
        _id: '3',
        username: 'user',
        email: 'user@test.com',
        role: 'user',
        permissions: []
      };

      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      (authService as any).authStateSubject.next({
        isAuthenticated: true,
        user: regularUser,
        token: 'mock-user-token'
      });

      const route = {} as any;
      const state = { url: '/admin/users' } as any;

      adminGuard.canActivate(route, state).subscribe((canAccess) => {
        expect(canAccess).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/home'], {
          queryParams: { error: 'admin-access-required' }
        });
        done();
      });
    });

    it('should redirect unauthenticated users to login', (done) => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      const route = {} as any;
      const state = { url: '/admin/users' } as any;

      adminGuard.canActivate(route, state).subscribe((canAccess) => {
        expect(canAccess).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: '/admin/users' }
        });
        done();
      });
    });
  });

  describe('✅ REQUIREMENT 2: User form can change user roles', () => {
    it('should have role field in user form', () => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;

      fixture.detectChanges();

      expect(component.userForm.get('role')).toBeDefined();
    });

    it('should load predefined roles for selection', () => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;

      fixture.detectChanges();

      expect(component.predefinedRoles).toBeDefined();
      expect(component.predefinedRoles.length).toBeGreaterThan(0);
      expect(component.predefinedRoles).toEqual(PREDEFINED_ROLES);
    });

    it('should update user role via API when form is submitted', (done) => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;
      component.userId = 'user-123';

      fixture.detectChanges();

      // Set form values
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        role: 'editor' // Change role to editor
      });

      // Spy on updateUser
      const updateSpy = jest.spyOn(userService, 'updateUser').mockReturnValue(
        of({
          _id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'editor',
          permissions: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );

      component.onSubmit();

      setTimeout(() => {
        expect(updateSpy).toHaveBeenCalledWith('user-123', expect.objectContaining({
          role: 'editor'
        }));
        done();
      }, 100);
    });

    it('should include role when creating new user', (done) => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;

      fixture.detectChanges();

      // Set form values for new user
      component.userForm.patchValue({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        role: 'viewer'
      });

      // Spy on createUser
      const createSpy = jest.spyOn(userService, 'createUser').mockReturnValue(
        of({
          _id: 'new-user-id',
          username: 'newuser',
          email: 'new@example.com',
          role: 'viewer',
          permissions: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );

      component.onSubmit();

      setTimeout(() => {
        expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
          role: 'viewer'
        }));
        done();
      }, 100);
    });
  });

  describe('✅ REQUIREMENT 3: Role changes update permissions correctly', () => {
    it('should update permissions when role is changed via dropdown', () => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;

      fixture.detectChanges();

      // Select admin role
      component.userForm.patchValue({ role: 'admin' });
      component.onRoleChange();

      // Get admin role permissions
      const adminRole = PREDEFINED_ROLES.find(r => r.id === 'admin');
      expect(adminRole).toBeDefined();

      // Verify permissions match admin role
      const selectedPermissions = component.getSelectedPermissions();
      expect(selectedPermissions.length).toBe(adminRole!.permissions!.length);
    });

    it('should clear permissions when role is deselected', () => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;

      fixture.detectChanges();

      // First select a role
      component.userForm.patchValue({ role: 'editor' });
      component.onRoleChange();

      // Then deselect
      component.userForm.patchValue({ role: '' });
      component.onRoleChange();

      const selectedPermissions = component.getSelectedPermissions();
      expect(selectedPermissions.length).toBe(0);
    });

    it('should sync permissions for each predefined role', () => {
      const fixture = TestBed.createComponent(UserFormComponent);
      const component = fixture.componentInstance;

      fixture.detectChanges();

      PREDEFINED_ROLES.forEach(role => {
        // Select role
        component.userForm.patchValue({ role: role.id });
        component.onRoleChange();

        // Verify permissions
        const selectedPermissions = component.getSelectedPermissions();
        expect(selectedPermissions.length).toBe(role.permissions?.length || 0);
      });
    });
  });

  describe('✅ VERIFICATION: Complete workflow test', () => {
    it('should complete full admin workflow: login → access form → change role → save', (done) => {
      // STEP 1: Admin login
      const adminUser = {
        _id: '1',
        username: 'admin',
        email: 'admin@test.com',
        role: 'admin',
        permissions: []
      };

      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      (authService as any).authStateSubject.next({
        isAuthenticated: true,
        user: adminUser,
        token: 'mock-admin-token'
      });

      // STEP 2: Verify admin can access admin routes
      const route = {} as any;
      const state = { url: '/admin/users/edit/user-123' } as any;

      adminGuard.canActivate(route, state).subscribe((canAccess) => {
        expect(canAccess).toBe(true);

        // STEP 3: Create user form component
        const fixture = TestBed.createComponent(UserFormComponent);
        const component = fixture.componentInstance;
        component.userId = 'user-123';

        fixture.detectChanges();

        // STEP 4: Change user role from viewer to editor
        component.userForm.patchValue({
          username: 'regularuser',
          email: 'regular@example.com',
          role: 'editor'
        });

        component.onRoleChange();

        // STEP 5: Verify role and permissions are updated
        expect(component.userForm.get('role')?.value).toBe('editor');
        const editorRole = PREDEFINED_ROLES.find(r => r.id === 'editor');
        const selectedPermissions = component.getSelectedPermissions();
        expect(selectedPermissions.length).toBe(editorRole!.permissions!.length);

        // STEP 6: Save the user
        const updateSpy = jest.spyOn(userService, 'updateUser').mockReturnValue(
          of({
            _id: 'user-123',
            username: 'regularuser',
            email: 'regular@example.com',
            role: 'editor',
            permissions: selectedPermissions,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        );

        component.onSubmit();

        setTimeout(() => {
          // STEP 7: Verify update was called with correct role
          expect(updateSpy).toHaveBeenCalledWith('user-123', expect.objectContaining({
            role: 'editor',
            permissions: expect.any(Array)
          }));

          done();
        }, 100);
      });
    });

    it('should prevent non-admin from accessing user management', (done) => {
      // Non-admin user
      const regularUser = {
        _id: '2',
        username: 'user',
        email: 'user@test.com',
        role: 'user',
        permissions: []
      };

      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      (authService as any).authStateSubject.next({
        isAuthenticated: true,
        user: regularUser,
        token: 'mock-user-token'
      });

      const route = {} as any;
      const state = { url: '/admin/users/edit/user-123' } as any;

      adminGuard.canActivate(route, state).subscribe((canAccess) => {
        expect(canAccess).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/home'], {
          queryParams: { error: 'admin-access-required' }
        });
        done();
      });
    });
  });
});
