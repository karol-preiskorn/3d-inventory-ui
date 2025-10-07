import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jest.Mocked<AuthenticationService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    const authSpy = {
      isAuthenticated: jest.fn()
    };
    const routerSpyObj = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthenticationService) as jest.Mocked<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/admin/users', root: route } as RouterStateSnapshot;
    });

    it('should return true if user is authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);

      const result = guard.canActivate(route, state);

      expect(result).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should return false and redirect to login if user is not authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);

      const result = guard.canActivate(route, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/admin/users' }
      });
    });

    it('should handle root path correctly', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      state = { url: '/', root: route } as RouterStateSnapshot;

      const result = guard.canActivate(route, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/' }
      });
    });

    it('should handle complex URLs with query params', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      state = { url: '/admin/users?search=test&page=2', root: route } as RouterStateSnapshot;

      const result = guard.canActivate(route, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/admin/users?search=test&page=2' }
      });
    });
  });

  describe('canActivateChild', () => {
    let childRoute: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      childRoute = new ActivatedRouteSnapshot();
      state = { url: '/admin/users/new', root: childRoute } as RouterStateSnapshot;
    });

    it('should return true if user is authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);

      const result = guard.canActivateChild(childRoute, state);

      expect(result).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should return false and redirect to login if user is not authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);

      const result = guard.canActivateChild(childRoute, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/admin/users/new' }
      });
    });

    it('should handle nested child routes', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      state = { url: '/admin/users/edit/123', root: childRoute } as RouterStateSnapshot;

      const result = guard.canActivateChild(childRoute, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/admin/users/edit/123' }
      });
    });
  });

  describe('edge cases', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/admin', root: route } as RouterStateSnapshot;
    });

    it('should handle undefined URL', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      state = { url: '', root: route } as RouterStateSnapshot;

      const result = guard.canActivate(route, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '' }
      });
    });

    it('should handle empty URL', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      state = { url: '', root: route } as RouterStateSnapshot;

      const result = guard.canActivate(route, state);

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '' }
      });
    });

    it('should work with multiple consecutive calls', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);

      guard.canActivate(route, state);
      guard.canActivate(route, state);

      expect(routerSpy.navigate).toHaveBeenCalledTimes(2);
    });

    it('should work when authentication state changes', () => {
      // First call - not authenticated
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      let result = guard.canActivate(route, state);
      expect(result).toBe(false);

      // Second call - authenticated
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      result = guard.canActivate(route, state);
      expect(result).toBe(true);
    });
  });
});
