import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

/**
 * Auth Guard to protect routes that require authentication
 *
 * This guard checks if the user has a valid JWT token and redirects to login if not.
 * It implements CanActivate and CanActivateChild to protect both routes and child routes.
 *
 * Usage:
 * - Add to route configuration: { path: 'admin', canActivate: [AuthGuard], ... }
 * - For child routes: { path: 'admin', canActivateChild: [AuthGuard], children: [...] }
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Determines if a route can be activated
   * @param route - The activated route snapshot
   * @param state - The router state snapshot
   * @returns true if authenticated, false otherwise
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(state.url);
  }

  /**
   * Determines if child routes can be activated
   * @param childRoute - The child route snapshot
   * @param state - The router state snapshot
   * @returns true if authenticated, false otherwise
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(state.url);
  }

  /**
   * Check if user is authenticated and handle redirection
   * @param url - The URL the user is trying to access
   * @returns true if authenticated, false otherwise
   */
  private checkAuthentication(url: string): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: url }
    });

    return false;
  }
}
