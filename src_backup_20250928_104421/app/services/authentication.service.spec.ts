import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { LoginRequest, LoginResponse, User } from '../shared/user';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

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
      const mockResponse: LoginResponse = { token: 'mock.jwt.token' };

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isAuthenticated()).toBeTruthy();
        expect(service.getCurrentToken()).toBe('mock.jwt.token');
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
    it('should return true if user has permission', () => {
      const user: User = {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        permissions: ['user:read', 'device:read']
      };

      // Manually set user state for testing
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'valid-token');
      service['initializeAuthState']();

      expect(service.hasPermission('user:read')).toBeTruthy();
      expect(service.hasPermission('admin:full')).toBeFalsy();
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
      localStorage.setItem('auth_token', 'test-token');
      service['initializeAuthState']();

      const headers = service.getAuthHeaders();
      expect(headers.get('Authorization')).toBe('Bearer test-token');
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should return headers without Authorization when not authenticated', () => {
      const headers = service.getAuthHeaders();
      expect(headers.get('Authorization')).toBeNull();
      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });
});
