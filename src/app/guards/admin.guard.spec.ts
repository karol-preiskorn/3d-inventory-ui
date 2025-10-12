import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { AdminGuard } from './admin.guard';
import { AuthenticationService } from '../services/authentication.service';
import { AuthState } from '../shared/user';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceMock: Partial<AuthenticationService>;
  let routerMock: Partial<Router>;
  let authStateSubject: BehaviorSubject<AuthState>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    // Create mock auth state subject
    authStateSubject = new BehaviorSubject<AuthState>({
      isAuthenticated: true,
      user: { _id: '1', username: 'admin', email: 'admin@test.com', role: 'admin', permissions: [] },
      token: 'mock-token'
    });

    // Create mock services
    authServiceMock = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      authState$: authStateSubject.asObservable()
    };

    routerMock = {
      navigate: jest.fn().mockResolvedValue(true)
    };

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AdminGuard);

    // Mock route snapshots
    routeSnapshot = {} as ActivatedRouteSnapshot;
    stateSnapshot = { url: '/admin/users' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true for authenticated admin user', (done) => {
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(true);

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(true);
          expect(routerMock.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect to login for unauthenticated user', (done) => {
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(false);

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
            queryParams: { returnUrl: '/admin/users' }
          });
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect to home for authenticated non-admin user', (done) => {
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(true);
      authStateSubject.next({
        isAuthenticated: true,
        user: { _id: '2', username: 'user', email: 'user@test.com', role: 'user', permissions: [] },
        token: 'mock-token'
      });

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerMock.navigate).toHaveBeenCalledWith(['/home'], {
            queryParams: { error: 'admin-access-required' }
          });
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect to home for viewer role', (done) => {
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(true);
      authStateSubject.next({
        isAuthenticated: true,
        user: { _id: '3', username: 'viewer', email: 'viewer@test.com', role: 'viewer', permissions: [] },
        token: 'mock-token'
      });

      const result = guard.canActivate(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerMock.navigate).toHaveBeenCalledWith(['/home'], {
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
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(true);
      authStateSubject.next({
        isAuthenticated: true,
        user: { _id: '1', username: 'admin', email: 'admin@test.com', role: 'admin', permissions: [] },
        token: 'mock-token'
      });

      const result = guard.canActivateChild(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(true);
          expect(routerMock.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should return false and redirect for non-admin user on child routes', (done) => {
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(true);
      authStateSubject.next({
        isAuthenticated: true,
        user: { _id: '2', username: 'user', email: 'user@test.com', role: 'user', permissions: [] },
        token: 'mock-token'
      });

      const result = guard.canActivateChild(routeSnapshot, stateSnapshot);

      if (result instanceof Observable) {
        result.subscribe((canActivate: boolean) => {
          expect(canActivate).toBe(false);
          expect(routerMock.navigate).toHaveBeenCalledWith(['/home'], {
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
