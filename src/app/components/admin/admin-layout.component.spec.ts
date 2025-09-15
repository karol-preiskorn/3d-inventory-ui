import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminLayoutComponent } from './admin-layout.component';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated', 'logout']);
    const userSpy = jasmine.createSpyObj('UserService', ['userHasPermission']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate'], { url: '/admin/users' });

    await TestBed.configureTestingModule({
      imports: [
        AdminLayoutComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init when authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    component.ngOnInit();

    expect(component.currentUser).toBeTruthy();
    expect(component.currentUser?.name).toBe('Admin User');
    expect(component.currentUser?.email).toBe('admin@3d-inventory.com');
  });

  it('should not load user when not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(component.currentUser).toBeNull();
  });

  it('should check permissions correctly when user exists', () => {
    component.currentUser = {
      _id: 'test',
      name: 'Test User',
      email: 'test@test.com',
      permissions: ['user_read']
    };
    userServiceSpy.userHasPermission.and.returnValue(true);

    const result = component.hasPermission('user_read');

    expect(result).toBe(true);
    expect(userServiceSpy.userHasPermission).toHaveBeenCalledWith(component.currentUser, 'user_read' as any);
  });

  it('should return false for permissions when no user', () => {
    component.currentUser = null;

    const result = component.hasPermission('user_read');

    expect(result).toBe(false);
    expect(userServiceSpy.userHasPermission).not.toHaveBeenCalled();
  });

  it('should toggle sidebar collapsed state', () => {
    component.sidebarCollapsed = false;

    component.toggleSidebar();

    expect(component.sidebarCollapsed).toBe(true);

    component.toggleSidebar();

    expect(component.sidebarCollapsed).toBe(false);
  });

  it('should toggle mobile menu state', () => {
    component.mobileMenuOpen = false;

    component.toggleMobileMenu();

    expect(component.mobileMenuOpen).toBe(true);

    component.toggleMobileMenu();

    expect(component.mobileMenuOpen).toBe(false);
  });

  it('should close mobile menu', () => {
    component.mobileMenuOpen = true;

    component.closeMobileMenu();

    expect(component.mobileMenuOpen).toBe(false);
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to home', () => {
    component.goToHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log profile navigation', () => {
    spyOn(console, 'log');

    component.goToProfile();

    expect(console.log).toHaveBeenCalledWith('Navigate to user profile');
  });

  it('should check if route is active', () => {
    const result = component.isRouteActive('/admin/users');

    expect(result).toBe(true);

    const inactiveResult = component.isRouteActive('/admin/other');

    expect(inactiveResult).toBe(false);
  });

  it('should have correct navigation items', () => {
    expect(component.navigationItems).toHaveSize(6);
    expect(component.navigationItems[0].path).toBe('/admin/users');
    expect(component.navigationItems[0].label).toBe('User Management');
    expect(component.navigationItems[0].permission).toBe('user_read');
  });

  it('should initialize with correct default values', () => {
    expect(component.sidebarCollapsed).toBe(false);
    expect(component.mobileMenuOpen).toBe(false);
    expect(component.currentUser).toBeNull();
  });

  describe('navigation items', () => {
    it('should include all expected navigation items', () => {
      const expectedPaths = [
        '/admin/users',
        '/device-list',
        '/models-list',
        '/attribute-dictionary-list',
        '/connection-list',
        '/floor-list'
      ];

      const actualPaths = component.navigationItems.map(item => item.path);

      expect(actualPaths).toEqual(expectedPaths);
    });

    it('should have icons for all navigation items', () => {
      component.navigationItems.forEach(item => {
        expect(item.icon).toBeTruthy();
        expect(item.icon).toContain('fas fa-');
      });
    });

    it('should have permissions for all navigation items', () => {
      component.navigationItems.forEach(item => {
        expect(item.permission).toBeTruthy();
        expect(item.permission).toMatch(/_read$/);
      });
    });
  });
});
