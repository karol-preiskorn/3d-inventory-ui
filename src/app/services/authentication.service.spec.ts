import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { LoginRequest, LoginResponse } from '../shared/user';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    const routerSpyObj = {
      navigate: jest.fn()
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
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and update auth state', () => {
      const loginRequest: LoginRequest = { username: 'carlo' };
      // Create a proper JWT token structure for testing
      const validPayload = { id: 1, username: 'carlo', exp: Math.floor(Date.now() / 1000) + 3600 };
      const mockToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;
      const mockResponse: LoginResponse = {
        token: mockToken,
        user: {
          _id: '1',
          name: 'Carlo',
          email: 'carlo@example.com',
          permissions: ['user:read']
        }
      };

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isAuthenticated()).toBeTruthy();
        expect(service.getCurrentToken()).toBe(mockToken);
      });

      const req = httpMock.expectOne('http://localhost:8080/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginRequest: LoginRequest = { username: 'invalid' };

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Invalid credentials');
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should logout and clear auth state', () => {
      // Set up authenticated state
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('auth_user', JSON.stringify({ _id: '1', name: 'Test User' }));

      service.logout();

      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.getCurrentToken()).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('hasPermission', () => {
    it('should return false when user has no permissions (as per current implementation)', () => {
      // Current service implementation sets permissions to empty array after login
      // Permissions are expected to be populated separately from user service
      const loginRequest: LoginRequest = { username: 'testuser' };
      const validPayload = {
        id: 1,
        username: 'testuser',
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      const mockToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;
      const mockResponse: LoginResponse = {
        token: mockToken
      };

      // Use the login method to properly set up auth state
      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne('http://localhost:8080/login');
      req.flush(mockResponse);

      const result = service.hasPermission('user:read');
      expect(result).toBeFalsy(); // Should be false as permissions are empty
    });

    it('should return false when user is not authenticated', () => {
      const result = service.hasPermission('user:read');
      expect(result).toBeFalsy();
    });
  });

  describe('token validation', () => {
    it('should detect expired tokens', () => {
      // Create an expired token (expired 1 hour ago)
      const expiredTime = Math.floor(Date.now() / 1000) - 3600;
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ id: 1, username: 'test', exp: expiredTime }));
      const signature = 'signature';
      const expiredToken = `${header}.${payload}.${signature}`;

      localStorage.setItem('auth_token', expiredToken);

      expect(service.validateToken()).toBeFalsy();
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should accept valid tokens', () => {
      // Create a valid token (expires in 1 hour)
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ id: 1, username: 'test', exp: futureTime }));
      const signature = 'signature';
      const validToken = `${header}.${payload}.${signature}`;

      localStorage.setItem('auth_token', validToken);
      localStorage.setItem('auth_user', JSON.stringify({
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        permissions: []
      }));

      service['initializeAuthState']();

      expect(service.validateToken()).toBeTruthy();
      expect(service.isAuthenticated()).toBeTruthy();
    });
  });

  describe('getAuthHeaders', () => {
    it('should return headers with Bearer token when authenticated', () => {
      // Setup authenticated state by simulating a login
      const loginRequest: LoginRequest = { username: 'testuser' };
      const validPayload = { id: 1, username: 'testuser', exp: Math.floor(Date.now() / 1000) + 3600 };
      const mockToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;
      const mockResponse: LoginResponse = {
        token: mockToken,
        user: {
          _id: '1',
          name: 'Test User',
          email: 'testuser@example.com',
          permissions: ['user:read']
        }
      };

      // Use the login method to properly set up auth state
      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne('http://localhost:8080/login');
      req.flush(mockResponse);

      const headers = service.getAuthHeaders();
      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });

    it('should return headers without Authorization when not authenticated', () => {
      const headers = service.getAuthHeaders();
      expect(headers.get('Authorization')).toBeNull();
      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });
});
