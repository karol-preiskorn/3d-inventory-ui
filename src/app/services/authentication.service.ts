import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import {
  AuthState,
  JwtPayload,
  LoginRequest,
  LoginResponse,
  User
} from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly API_URL = environment.baseurl; // Update based on your API URL
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize auth state from localStorage on service creation
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user && !this.isTokenExpired(token)) {
      this.authStateSubject.next({
        isAuthenticated: true,
        user: user,
        token: token
      });
    } else {
      // Clear invalid data
      this.clearStoredAuth();
    }
  }

  /**
   * Login user with username/password
   */
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);

            // Decode token to get user info
            const payload = this.decodeToken(response.token);
            const user: User = {
              _id: payload.id.toString(),
              name: payload.username,
              email: `${payload.username}@example.com`, // API doesn't return email
              permissions: [], // Will be populated from user service if needed
              token: response.token
            };

            this.setUser(user);

            this.authStateSubject.next({
              isAuthenticated: true,
              user: user,
              token: response.token
            });
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user and clear authentication data
   */
  logout(): void {
    this.clearStoredAuth();
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
    this.router.navigate(['/login']);
  }

  /**
   * Get current authentication state
   */
  getCurrentAuth(): AuthState {
    return this.authStateSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Get current token
   */
  getCurrentToken(): string | null {
    return this.authStateSubject.value.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getCurrentToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Get authorization headers for API calls
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getCurrentToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Store token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Store user in localStorage
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user from localStorage
   */
  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Clear stored authentication data
   */
  private clearStoredAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Decode JWT token payload
   */
  private decodeToken(token: string): JwtPayload {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) {
        return false; // No expiration set
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't decode, consider it expired
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Server error: ${error.status}`;
      }
    }

    console.error('Authentication error:', error);
    return throwError(() => new Error(errorMessage));
  };

  /**
   * Refresh user data from API (if endpoint exists)
   */
  refreshUserData(): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }

    // This would require a getUserById endpoint in the API
    return this.http.get<User>(`${this.API_URL}/users/${currentUser._id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(user => {
        this.setUser(user);
        const currentAuth = this.authStateSubject.value;
        this.authStateSubject.next({
          ...currentAuth,
          user: user
        });
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Check token validity and auto-logout if expired
   */
  validateToken(): boolean {
    const token = this.getCurrentToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }
}
