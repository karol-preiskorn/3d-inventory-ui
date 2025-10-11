import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { AdminGuard } from './admin.guard';
import { AuthenticationService } from '../services/authentication.service';
import { AuthState } from '../shared/user';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    // Create spies
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated'], {
      authState$: of({
        isAuthenticated: true,
        user: { _id: '1', username: 'admin', email: 'admin@test.com', role: 'admin', permissions: [] },
        token: 'mock-token'
      } as AuthState)
    });
    const routSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock route snapshots
    routeSnapshot = {} as ActivatedRouteSnapshot;
    stateSnapshot = { url: '/admin/users' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true for authenticated admin user', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(true);
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect to login for unauthenticated user', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
            queryParams: { returnUrl: '/admin/users' }
          });
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect to home for authenticated non-admin user', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      Object.defineProperty(authServiceSpy, 'authState$', {
        value: of({
          isAuthenticated: true,
          user: { _id: '2', username: 'user', email: 'user@test.com', role: 'user', permissions: [] },
          token: 'mock-token'
        } as AuthState),
        writable: true
      });

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
            queryParams: { error: 'admin-access-required' }
          });
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect to home for viewer role', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      Object.defineProperty(authServiceSpy, 'authState$', {
        value: of({
          isAuthenticated: true,
          user: { _id: '3', username: 'viewer', email: 'viewer@test.com', role: 'viewer', permissions: [] },
          token: 'mock-token'
        } as AuthState),
        writable: true
      });

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
            queryParams: { error: 'admin-access-required' }
          });
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });
  });

  describe('canActivateChild', () => {
    it('should return true for authenticated admin user on child routes', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const result = guard.canActivateChild(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(true);
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect for non-admin user on child routes', (done) => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      Object.defineProperty(authServiceSpy, 'authState$', {
        value: of({
          isAuthenticated: true,
          user: { _id: '2', username: 'user', email: 'user@test.com', role: 'user', permissions: [] },
          token: 'mock-token'
        } as AuthState),
        writable: true
      });

      const result = guard.canActivateChild(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
            queryParams: { error: 'admin-access-required' }
          });
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });
  });
});
