import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  ApiError,
  CreateUserRequest,
  Permission,
  PREDEFINED_ROLES,
  Role,
  UpdateUserRequest,
  User
} from '../shared/user';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';

// Response interfaces for API calls
interface UserResponse {
  acknowledged?: boolean;
  insertedId?: string;
  modifiedCount?: number;
  deletedCount?: number;
  message?: string;
}

interface PermissionResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.baseurl; // Use environment configuration
  private readonly USERS_ENDPOINT = '/user-management';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}${this.USERS_ENDPOINT}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}${this.USERS_ENDPOINT}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get user by user ID (different endpoint from API)
   */
  getUserByUserId(id: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}${this.USERS_ENDPOINT}/user/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get users by specific permission/right
   */
  getUsersByPermission(permission: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}${this.USERS_ENDPOINT}/rights/${permission}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create new user
   */
  createUser(userRequest: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}${this.USERS_ENDPOINT}`, userRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update existing user
   */
  updateUser(id: string, userRequest: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}${this.USERS_ENDPOINT}/${id}`, userRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete user by ID
   */
  deleteUser(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.API_URL}${this.USERS_ENDPOINT}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete all users (admin only)
   */
  deleteAllUsers(): Observable<UserResponse> {
    return this.http.delete(`${this.API_URL}${this.USERS_ENDPOINT}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add permission to user
   */
  addPermissionToUser(userId: string, permission: string): Observable<PermissionResponse> {
    return this.http.post<PermissionResponse>(`${this.API_URL}${this.USERS_ENDPOINT}/user/${userId}/right/${permission}`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove permission from user
   */
  removePermissionFromUser(userId: string, permission: string): Observable<PermissionResponse> {
    return this.http.delete<PermissionResponse>(`${this.API_URL}${this.USERS_ENDPOINT}/user/${userId}/right/${permission}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update user permissions
   */
  updateUserPermissions(userId: string, permissions: string[]): Observable<UserResponse> {
    const updateRequest: UpdateUserRequest = {
      permissions: permissions
    };

    return this.updateUser(userId, updateRequest);
  }

  /**
   * Get all available permissions
   */
  getAvailablePermissions(): Permission[] {
    return Object.values(Permission);
  }

  /**
   * Get predefined roles
   */
  getPredefinedRoles(): Role[] {
    return PREDEFINED_ROLES;
  }

  /**
   * Get permissions for a specific role
   */
  getPermissionsForRole(roleId: string): Permission[] {
    const role = PREDEFINED_ROLES.find(r => r.id === roleId);
    return role ? role.permissions : [];
  }

  /**
   * Assign role to user (replaces current permissions)
   */
  assignRoleToUser(userId: string, roleId: string): Observable<UserResponse> {
    const permissions = this.getPermissionsForRole(roleId);
    return this.updateUserPermissions(userId, permissions);
  }

  /**
   * Add role permissions to user (merges with existing permissions)
   */
  addRoleToUser(userId: string, roleId: string): Observable<User> {
    const rolePermissions = this.getPermissionsForRole(roleId);

    return this.getUserById(userId).pipe(
      map(user => {
        const currentPermissions = user.permissions || [];
        const newPermissions = [...new Set([...currentPermissions, ...rolePermissions])];
        return { ...user, permissions: newPermissions };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Check if user has specific permission
   */
  userHasPermission(user: User, permission: Permission): boolean {
    return user.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  userHasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some(permission => this.userHasPermission(user, permission));
  }

  /**
   * Check if user has admin privileges
   */
  userIsAdmin(user: User): boolean {
    return this.userHasAnyPermission(user, [Permission.ADMIN_FULL, Permission.SYSTEM_ADMIN]);
  }

  /**
   * Get user's effective role based on permissions
   */
  getUserRole(user: User): Role | null {
    const userPermissions = user.permissions || [];

    // Check for exact role matches (from highest to lowest privilege)
    for (const role of PREDEFINED_ROLES.slice().reverse()) {
      const rolePermissions = role.permissions.map(p => p.toString());
      const hasAllRolePermissions = rolePermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (hasAllRolePermissions) {
        return role;
      }
    }

    // Return custom role if no predefined role matches
    return {
      id: 'custom',
      name: 'Custom',
      description: 'Custom permission set',
      permissions: userPermissions.map(p => p as Permission)
    };
  }

  /**
   * Validate user data before creation/update
   */
  validateUserData(userData: CreateUserRequest | UpdateUserRequest): string[] {
    const errors: string[] = [];

    if ('name' in userData && userData.name) {
      if (userData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
    }

    if ('email' in userData && userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    if ('password' in userData && userData.password) {
      if (userData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
    }

    if ('permissions' in userData && userData.permissions) {
      const validPermissions = this.getAvailablePermissions();
      const invalidPermissions = userData.permissions.filter(
        permission => !validPermissions.includes(permission as Permission)
      );

      if (invalidPermissions.length > 0) {
        errors.push(`Invalid permissions: ${invalidPermissions.join(', ')}`);
      }
    }

    return errors;
  }

  /**
   * Search users by name or email
   */
  searchUsers(query: string): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )),
      catchError(this.handleError)
    );
  }

  /**
   * Get users with pagination
   */
  getUsersPaginated(page: number = 1, limit: number = 10): Observable<{ users: User[], total: number }> {
    return this.getUsers().pipe(
      map(users => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return {
          users: users.slice(startIndex, endIndex),
          total: users.length
        };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiError;
        errorMessage = apiError.message || `Server error: ${error.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Server error: ${error.status}`;
      }
    }

    console.error('User service error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
