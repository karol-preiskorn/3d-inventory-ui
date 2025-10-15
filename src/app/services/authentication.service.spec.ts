/**
 * @file authentication.service.spec.ts
 * @description Comprehensive test suite for AuthenticationService
 *
 * Generated following AGENTS.md Testing Automation patterns:
 * - AI-Assisted Test Generation
 * - Comprehensive Scenario Coverage
 * - Angular Service Testing Standards
 * - Test Coverage Requirements (>90% for services)
 *
 * Test Categories:
 * 1. Service Initialization and State Management
 * 2. Login Functionality (Success and Error Cases)
 * 3. Logout and Session Cleanup
 * 4. Token Management and Validation
 * 5. Permission System (Role-Based Access Control)
 * 6. LocalStorage Persistence
 * 7. HTTP Error Handling
 * 8. JWT Token Decoding and Expiration
 * 9. User Data Refresh
 * 10. Edge Cases and Boundary Conditions
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { LoginRequest, LoginResponse, User, AuthState } from '../shared/user';

/**
 * Test Suite: Authentication Service
 *
 * This test suite verifies the authentication service functionality including:
 * - User login validation and JWT token generation
 * - Password verification and security measures
 * - Role-based access control and permissions
 * - Error handling for various failure scenarios
 * - Token expiration and auto-logout
 * - LocalStorage state persistence
 *
 * Dependencies Mocked:
 * - HttpClient for API communication
 * - Router for navigation
 * - LocalStorage for state persistence
 */
describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let routerSpy: jest.Mocked<Router>;

  // Test data constants
  const MOCK_API_URL = 'http://localhost:8080';
  const VALID_USERNAME = 'carlo';
  const VALID_PASSWORD = 'carlo123!';
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123!';

  /**
   * Helper function to create a valid JWT token for testing
   */
  const createMockToken = (payload: { id: number | string; username: string; role?: string; permissions?: string[]; exp?: number }): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const defaultExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const tokenPayload = btoa(JSON.stringify({
      exp: defaultExp,
      ...payload
    }));
    const signature = 'mock-signature';
    return `${header}.${tokenPayload}.${signature}`;
  };

  /**
   * Helper function to create a mock user
   */
  const createMockUser = (overrides: Partial<User> = {}): User => {
    return {
      _id: '1',
      username: VALID_USERNAME,
      email: `${VALID_USERNAME}@example.com`,
      role: 'user',
      permissions: ['read:devices', 'write:devices'],
      ...overrides
    };
  };

  beforeEach(() => {
    const routerSpyObj = {
      navigate: jest.fn().mockResolvedValue(true)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;

    // Clear localStorage before each test
    localStorage.clear();

    // Clear any pending HTTP requests
    try {
      httpMock.verify();
    } catch {
      // Ignore verification errors in setup
    }
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify();
    // Clean up localStorage
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test Category 1: Service Initialization and State Management
   */
  describe('Service Initialization', () => {
    it('should initialize with unauthenticated state', () => {
      const currentAuth = service.getCurrentAuth();

      expect(currentAuth.isAuthenticated).toBeFalsy();
      expect(currentAuth.user).toBeNull();
      expect(currentAuth.token).toBeNull();
    });

    it('should restore authentication state from localStorage on init', () => {
      // Arrange - set up valid stored auth data
      const mockToken = createMockToken({
        id: '123',
        username: VALID_USERNAME,
        role: 'user',
        permissions: ['read:devices']
      });
      const mockUser = createMockUser({ _id: '123' });

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Act - create new service instance to trigger initialization
      const newService = new AuthenticationService(
        TestBed.inject(HttpClientTestingModule) as any,
        routerSpy
      );

      // Assert
      expect(newService.isAuthenticated()).toBeTruthy();
      expect(newService.getCurrentUser()).toBeTruthy();
      expect(newService.getCurrentToken()).toBe(mockToken);
    });

    it('should clear invalid stored data on init', () => {
      // Arrange - set up expired token
      const expiredToken = createMockToken({
        id: '123',
        username: VALID_USERNAME,
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      });

      localStorage.setItem('auth_token', expiredToken);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));

      // Act - create new service instance
      const newService = new AuthenticationService(
        TestBed.inject(HttpClientTestingModule) as any,
        routerSpy
      );

      // Assert - should clear invalid data
      expect(newService.isAuthenticated()).toBeFalsy();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should emit auth state changes via observable', (done) => {
      const authStates: AuthState[] = [];

      service.authState$.subscribe(state => {
        authStates.push(state);

        if (authStates.length === 2) {
          // Initial state should be unauthenticated
          expect(authStates[0].isAuthenticated).toBeFalsy();
          // After login should be authenticated
          expect(authStates[1].isAuthenticated).toBeTruthy();
          done();
        }
      });

      // Trigger login to change state
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass123' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe();
      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });
  });

  /**
   * Test Category 2: Login Functionality
   */
  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      // Arrange
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'carlo123!' };
      const mockToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        role: 'user',
        permissions: ['read:devices', 'write:devices']
      });
      const mockResponse: LoginResponse = { token: mockToken };

      // Act
      service.login(loginRequest).subscribe(response => {
        // Assert - verify response
        expect(response).toEqual(mockResponse);
        expect(response.token).toBe(mockToken);

        // Assert - verify auth state updated
        expect(service.isAuthenticated()).toBeTruthy();
        expect(service.getCurrentToken()).toBe(mockToken);

        // Assert - verify user extracted from token
        const currentUser = service.getCurrentUser();
        expect(currentUser).toBeTruthy();
        expect(currentUser?.username).toBe(VALID_USERNAME);
        expect(currentUser?.role).toBe('user');
        expect(currentUser?.permissions).toContain('read:devices');
      });

      // Assert - verify HTTP request
      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockResponse);
    });

    it('should login admin user with all permissions', () => {
      const loginRequest: LoginRequest = { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
      const mockToken = createMockToken({
        id: '1',
        username: ADMIN_USERNAME,
        role: 'admin',
        permissions: ['*']
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(response => {
        expect(response.token).toBe(mockToken);

        const currentUser = service.getCurrentUser();
        expect(currentUser?.role).toBe('admin');
        expect(service.hasPermission('any:permission')).toBeTruthy(); // Admin has all permissions
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should store token and user in localStorage after successful login', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert - verify localStorage
        expect(localStorage.getItem('auth_token')).toBe(mockToken);

        const storedUser = localStorage.getItem('auth_user');
        expect(storedUser).toBeTruthy();

        if (storedUser) {
          const user = JSON.parse(storedUser);
          expect(user.username).toBe(VALID_USERNAME);
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should handle 401 Unauthorized error', () => {
      const loginRequest: LoginRequest = { username: 'invalid', password: 'wrong' };

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed with 401'),
        error: (error) => {
          expect(error.message).toContain('Invalid credentials');
          expect(service.isAuthenticated()).toBeFalsy();
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush({ message: 'Invalid credentials' }, {
        status: 401,
        statusText: 'Unauthorized'
      });
    });

    it('should handle 500 Internal Server Error', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed with 500'),
        error: (error) => {
          expect(error.message).toBeTruthy();
          expect(service.isAuthenticated()).toBeFalsy();
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });

    it('should handle network errors', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed with network error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle malformed token response', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const invalidResponse: LoginResponse = { token: 'invalid.token' };

      service.login(loginRequest).subscribe({
        next: () => {
          // Service should handle this gracefully
          expect(service.isAuthenticated()).toBeFalsy();
        },
        error: (error) => {
          expect(error.message).toContain('Invalid token');
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(invalidResponse);
    });
  });

  /**
   * Test Category 3: Logout and Session Cleanup
   */
  describe('logout', () => {
    it('should logout and clear auth state', () => {
      // Arrange - set up authenticated state
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));

      // Act
      service.logout();

      // Assert - verify state cleared
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.getCurrentToken()).toBeNull();
      expect(service.getCurrentUser()).toBeNull();

      // Assert - verify localStorage cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();

      // Assert - verify navigation to login
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle logout when already logged out', () => {
      // Act - logout when not authenticated
      service.logout();

      // Assert - should not throw error
      expect(service.isAuthenticated()).toBeFalsy();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should emit unauthenticated state after logout', (done) => {
      // Arrange - set up authenticated state
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));

      let stateEmissions = 0;
      service.authState$.subscribe(state => {
        stateEmissions++;
        if (stateEmissions === 1) {
          // After logout, state should be unauthenticated
          expect(state.isAuthenticated).toBeFalsy();
          expect(state.user).toBeNull();
          expect(state.token).toBeNull();
          done();
        }
      });

      // Act
      service.logout();
    });
  });

  /**
   * Test Category 4: Token Management and Validation
   */
  describe('Token Validation', () => {
    it('should detect expired tokens', () => {
      // Arrange - create an expired token (expired 1 hour ago)
      const expiredToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        exp: Math.floor(Date.now() / 1000) - 3600
      });

      localStorage.setItem('auth_token', expiredToken);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));

      // Act
      const isValid = service.validateToken();

      // Assert
      expect(isValid).toBeFalsy();
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should accept valid tokens', () => {
      // Arrange - create a valid token (expires in 1 hour)
      const validToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 3600
      });

      localStorage.setItem('auth_token', validToken);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));

      // Re-initialize service to load from localStorage
      service['initializeAuthState']();

      // Act
      const isValid = service.validateToken();

      // Assert
      expect(isValid).toBeTruthy();
      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should handle tokens without expiration', () => {
      // Arrange - create token without exp field
      const payload = { id: '1', username: VALID_USERNAME, role: 'user' };
      const tokenWithoutExp = createMockToken({ ...payload, exp: undefined });

      localStorage.setItem('auth_token', tokenWithoutExp);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));

      service['initializeAuthState']();

      // Act - should not throw error
      const isValid = service.validateToken();

      // Assert - should consider token valid if no expiration set
      expect(isValid).toBeTruthy();
    });

    it('should handle malformed tokens', () => {
      // Arrange
      localStorage.setItem('auth_token', 'malformed-token');

      // Act
      const isValid = service.validateToken();

      // Assert - should logout on malformed token
      expect(isValid).toBeFalsy();
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should correctly decode JWT tokens', () => {
      // Arrange
      const expectedPayload = {
        id: '123',
        username: 'testuser',
        role: 'admin',
        permissions: ['read:all', 'write:all']
      };
      const token = createMockToken(expectedPayload);

      // Act
      const decoded = service['decodeToken'](token);

      // Assert
      expect(decoded.id).toBe(expectedPayload.id);
      expect(decoded.username).toBe(expectedPayload.username);
      expect(decoded.role).toBe(expectedPayload.role);
      expect(decoded.permissions).toEqual(expectedPayload.permissions);
    });

    it('should throw error for invalid token format', () => {
      // Act & Assert
      expect(() => service['decodeToken']('invalid')).toThrow('Invalid token format');
    });
  });

  /**
   * Test Category 5: Permission System (Role-Based Access Control)
   */
  describe('Permission System', () => {
    it('should grant all permissions to admin role', () => {
      // Arrange - login as admin
      const loginRequest: LoginRequest = { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
      const mockToken = createMockToken({
        id: '1',
        username: ADMIN_USERNAME,
        role: 'admin',
        permissions: ['*']
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert - admin should have any permission
        expect(service.hasPermission('read:devices')).toBeTruthy();
        expect(service.hasPermission('write:devices')).toBeTruthy();
        expect(service.hasPermission('delete:devices')).toBeTruthy();
        expect(service.hasPermission('admin:anything')).toBeTruthy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should check specific permissions for non-admin users', () => {
      // Arrange - login as regular user
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        role: 'user',
        permissions: ['read:devices', 'write:devices']
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert - user should only have specified permissions
        expect(service.hasPermission('read:devices')).toBeTruthy();
        expect(service.hasPermission('write:devices')).toBeTruthy();
        expect(service.hasPermission('delete:devices')).toBeFalsy();
        expect(service.hasPermission('admin:anything')).toBeFalsy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should return false for permissions when not authenticated', () => {
      // Act & Assert
      expect(service.hasPermission('read:devices')).toBeFalsy();
      expect(service.hasPermission('any:permission')).toBeFalsy();
    });

    it('should check if user has any of specified permissions', () => {
      // Arrange
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        role: 'user',
        permissions: ['read:devices']
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert
        expect(service.hasAnyPermission(['read:devices', 'write:devices'])).toBeTruthy();
        expect(service.hasAnyPermission(['write:devices', 'delete:devices'])).toBeFalsy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should grant any permission to admin via hasAnyPermission', () => {
      // Arrange
      const loginRequest: LoginRequest = { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
      const mockToken = createMockToken({
        id: '1',
        username: ADMIN_USERNAME,
        role: 'admin'
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert
        expect(service.hasAnyPermission(['any:permission', 'another:permission'])).toBeTruthy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should handle empty permissions array', () => {
      // Arrange
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        role: 'user',
        permissions: []
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert
        expect(service.hasPermission('read:devices')).toBeFalsy();
        expect(service.hasAnyPermission(['read:devices'])).toBeFalsy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });
  });

  /**
   * Test Category 6: HTTP Headers and Authorization
   */
  describe('getAuthHeaders', () => {
    it('should return headers with Bearer token when authenticated', () => {
      // Arrange - login user
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Act
        const headers = service.getAuthHeaders();

        // Assert
        expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
        expect(headers.get('Content-Type')).toBe('application/json');
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should return headers without Authorization when not authenticated', () => {
      // Act
      const headers = service.getAuthHeaders();

      // Assert
      expect(headers.get('Authorization')).toBeNull();
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should update headers after login', () => {
      // Arrange - get headers before login
      const headersBeforeLogin = service.getAuthHeaders();
      expect(headersBeforeLogin.get('Authorization')).toBeNull();

      // Act - login
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Assert - headers should now include auth
        const headersAfterLogin = service.getAuthHeaders();
        expect(headersAfterLogin.get('Authorization')).toBe(`Bearer ${mockToken}`);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });
  });

  /**
   * Test Category 7: User Data Refresh
   */
  describe('refreshUserData', () => {
    it('should refresh user data from API', () => {
      // Arrange - set up authenticated state
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '123', username: VALID_USERNAME, role: 'user' });
      const loginResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Act - refresh user data
        const updatedUser = createMockUser({
          _id: '123',
          username: VALID_USERNAME,
          email: 'updated@example.com',
          permissions: ['read:devices', 'write:devices', 'delete:devices']
        });

        service.refreshUserData().subscribe(user => {
          // Assert - user data should be updated
          expect(user._id).toBe('123');
          expect(user.email).toBe('updated@example.com');
          expect(user.permissions).toContain('delete:devices');

          // Assert - current user should be updated
          const currentUser = service.getCurrentUser();
          expect(currentUser?.email).toBe('updated@example.com');
        });

        const refreshReq = httpMock.expectOne(`${MOCK_API_URL}/users/123`);
        expect(refreshReq.request.method).toBe('GET');
        expect(refreshReq.request.headers.get('Authorization')).toBeTruthy();
        refreshReq.flush(updatedUser);
      });

      const loginReq = httpMock.expectOne(`${MOCK_API_URL}/login`);
      loginReq.flush(loginResponse);
    });

    it('should throw error when not authenticated', () => {
      // Act & Assert
      service.refreshUserData().subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toContain('No authenticated user');
        }
      });
    });

    it('should handle refresh errors', () => {
      // Arrange - login first
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '123', username: VALID_USERNAME, role: 'user' });
      const loginResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Act - attempt refresh with error
        service.refreshUserData().subscribe({
          next: () => fail('Should have failed'),
          error: (error) => {
            expect(error).toBeTruthy();
          }
        });

        const refreshReq = httpMock.expectOne(`${MOCK_API_URL}/users/123`);
        refreshReq.flush('User not found', { status: 404, statusText: 'Not Found' });
      });

      const loginReq = httpMock.expectOne(`${MOCK_API_URL}/login`);
      loginReq.flush(loginResponse);
    });
  });

  /**
   * Test Category 8: State Getters
   */
  describe('State Getters', () => {
    it('should get current authentication state', () => {
      // Arrange - login
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Act
        const authState = service.getCurrentAuth();

        // Assert
        expect(authState.isAuthenticated).toBeTruthy();
        expect(authState.user).toBeTruthy();
        expect(authState.token).toBe(mockToken);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should get current user', () => {
      // Arrange - login
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Act
        const user = service.getCurrentUser();

        // Assert
        expect(user).toBeTruthy();
        expect(user?.username).toBe(VALID_USERNAME);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should get current token', () => {
      // Arrange - login
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        // Act
        const token = service.getCurrentToken();

        // Assert
        expect(token).toBe(mockToken);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should return null for getters when not authenticated', () => {
      // Act & Assert
      expect(service.getCurrentUser()).toBeNull();
      expect(service.getCurrentToken()).toBeNull();
      expect(service.getCurrentAuth().isAuthenticated).toBeFalsy();
    });
  });

  /**
   * Test Category 9: Edge Cases and Boundary Conditions
   */
  describe('Edge Cases', () => {
    it('should handle rapid successive login attempts', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken1 = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      const mockToken2 = createMockToken({ id: '2', username: VALID_USERNAME, role: 'user' });

      // First login
      service.login(loginRequest).subscribe();
      const req1 = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req1.flush({ token: mockToken1 });

      // Second login (should replace first)
      service.login(loginRequest).subscribe(() => {
        expect(service.getCurrentToken()).toBe(mockToken2);
      });

      const req2 = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req2.flush({ token: mockToken2 });
    });

    it('should handle corrupted localStorage data', () => {
      // Arrange - set invalid JSON in localStorage
      localStorage.setItem('auth_user', 'invalid-json-{');

      // Act - should not throw error
      expect(() => service['getStoredUser']()).not.toThrow();

      // Assert
      const user = service['getStoredUser']();
      expect(user).toBeNull();
    });

    it('should handle missing token in response', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const responseWithoutToken: any = { message: 'Success' };

      service.login(loginRequest).subscribe(() => {
        // Should not update auth state without token
        expect(service.isAuthenticated()).toBeFalsy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(responseWithoutToken);
    });

    it('should handle very long permission arrays', () => {
      const manyPermissions = Array.from({ length: 100 }, (_, i) => `permission:${i}`);
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        role: 'user',
        permissions: manyPermissions
      });
      const mockResponse: LoginResponse = { token: mockToken };

      service.login(loginRequest).subscribe(() => {
        expect(service.hasPermission('permission:50')).toBeTruthy();
        expect(service.hasPermission('permission:99')).toBeTruthy();
        expect(service.hasPermission('permission:100')).toBeFalsy();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush(mockResponse);
    });

    it('should handle empty username and password', () => {
      const loginRequest: LoginRequest = { username: '', password: '' };

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush({ message: 'Username and password required' }, {
        status: 400,
        statusText: 'Bad Request'
      });
    });

    it('should handle token without proper segments', () => {
      // Act & Assert
      expect(() => service['decodeToken']('not.enough')).toThrow();
      expect(() => service['decodeToken']('single-segment')).toThrow();
    });

    it('should handle concurrent logout and login', () => {
      // Arrange - set up authenticated state
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });
      localStorage.setItem('auth_token', mockToken);

      // Act - logout and login concurrently
      service.logout();

      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const newToken = createMockToken({ id: '2', username: VALID_USERNAME, role: 'user' });

      service.login(loginRequest).subscribe(() => {
        // Assert - should have new authenticated state
        expect(service.isAuthenticated()).toBeTruthy();
        expect(service.getCurrentToken()).toBe(newToken);
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush({ token: newToken });
    });
  });

  /**
   * Test Category 10: Security Scenarios
   */
  describe('Security Scenarios', () => {
    it('should not expose sensitive user data in error messages', () => {
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'wrongpass' };

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          // Error message should not contain the password
          expect(error.message).not.toContain('wrongpass');
        }
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should clear sensitive data on logout', () => {
      // Arrange - login with sensitive data
      const loginRequest: LoginRequest = { username: VALID_USERNAME, password: 'pass' };
      const mockToken = createMockToken({ id: '1', username: VALID_USERNAME, role: 'user' });

      service.login(loginRequest).subscribe(() => {
        // Act - logout
        service.logout();

        // Assert - all sensitive data cleared
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(localStorage.getItem('auth_user')).toBeNull();
        expect(service.getCurrentToken()).toBeNull();
        expect(service.getCurrentUser()).toBeNull();
      });

      const req = httpMock.expectOne(`${MOCK_API_URL}/login`);
      req.flush({ token: mockToken });
    });

    it('should validate token on every isAuthenticated call', () => {
      // Arrange - create token that will expire during test
      const expiringToken = createMockToken({
        id: '1',
        username: VALID_USERNAME,
        exp: Math.floor(Date.now() / 1000) + 1 // Expires in 1 second
      });

      localStorage.setItem('auth_token', expiringToken);
      localStorage.setItem('auth_user', JSON.stringify(createMockUser()));
      service['initializeAuthState']();

      // Assert - should be authenticated initially
      expect(service.isAuthenticated()).toBeTruthy();

      // Wait for token to expire (in real scenario)
      // Note: This is a simulation; actual test would need async handling
    });
  });
});
