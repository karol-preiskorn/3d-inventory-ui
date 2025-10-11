import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

/**
 * Admin Guard to protect routes that require admin role
 *
 * This guard checks if the user is authenticated AND has the admin role.
 * It extends the basic authentication check with role-based access control.
 *
 * Usage:
 * - Add to route configuration: { path: 'admin', canActivate: [AdminGuard], ... }
 * - For child routes: { path: 'admin', canActivateChild: [AdminGuard], children: [...] }
 *
 * @example
 * ```typescript
 * const routes: Routes = [
 *   {
 *     path: 'admin',
 *     canActivate: [AdminGuard],
 *     canActivateChild: [AdminGuard],
 *     children: [
 *       { path: 'users', component: UserListComponent }
 *     ]
 *   }
 * ];
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Determines if a route can be activated by checking for admin role
   * @param route - The activated route snapshot
   * @param state - The router state snapshot
   * @returns Observable<boolean> true if user is admin, false otherwise
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess(state.url);
  }

  /**
   * Determines if child routes can be activated by checking for admin role
   * @param childRoute - The child route snapshot
   * @param state - The router state snapshot
   * @returns Observable<boolean> true if user is admin, false otherwise
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess(state.url);
  }

  /**
   * Check if user is authenticated and has admin role
   * @param url - The URL the user is trying to access
   * @returns Observable<boolean> true if admin, false otherwise
   */
  private checkAdminAccess(url: string): Observable<boolean> {
    // First check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Not authenticated - redirect to login
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: url }
      });
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    // User is authenticated - check if they have admin role
    return this.authService.authState$.pipe(
      map(authState => {
        const user = authState.user;
        const isAdmin = user?.role === 'admin';

        if (!isAdmin) {
          // User is authenticated but not admin - redirect to home with error message
          console.warn(`Access denied: User ${user?.username} attempted to access admin area without admin role`);
          this.router.navigate(['/home'], {
            queryParams: { error: 'admin-access-required' }
          });
          return false;
        }

        // User is admin - allow access
        return true;
      })
    );
  }
}
