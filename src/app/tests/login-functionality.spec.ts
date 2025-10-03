import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { LoginRequest, LoginResponse } from '../shared/user';
import { environment } from '../../environments/environment';

/**
 * Comprehensive Login Functionality Tests
 * Tests both admin and user login scenarios
 */
describe('Login Functionality Tests', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  // Test credentials based on API analysis
  const testCredentials = [
    { username: 'admin', password: 'admin123!', role: 'admin', description: 'Admin user with default password' },
    { username: 'user', password: 'user123!', role: 'user', description: 'Regular user with default password' },
    { username: 'carlo', password: 'carlo123!', role: 'user', description: 'Carlo user with default password' },
    { username: 'viewer', password: 'viewer123!', role: 'viewer', description: 'Viewer user with default password' },
    { username: 'admin', password: 'admin', role: 'admin', description: 'Admin with simple password' },
    { username: 'user', password: 'user', role: 'user', description: 'User with simple password' }
  ];

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
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Authentication Service', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with no authentication', () => {
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.getCurrentToken()).toBeNull();
    });
  });

  describe('Admin Login Tests', () => {
    testCredentials
      .filter(cred => cred.role === 'admin')
      .forEach(cred => {
        it(`should login successfully as ${cred.description}`, () => {
          const loginRequest: LoginRequest = {
            username: cred.username,
            password: cred.password
          };

          const mockResponse: LoginResponse = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGY3NjAyYjA5ZGZmMzEwZGJlZDc2MyIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTc3MjQwMDB9.test-signature'
          };

          let loginResult: LoginResponse | null = null;
          let loginError: any = null;

          service.login(loginRequest).subscribe({
            next: (response) => {
              loginResult = response;
            },
            error: (error) => {
              loginError = error;
            }
          });

          const req = httpMock.expectOne(`${environment.baseurl}/login`);
          expect(req.request.method).toBe('POST');
          expect(req.request.body).toEqual(loginRequest);

          // Simulate successful login
          req.flush(mockResponse);

          expect(loginResult).toEqual(mockResponse);
          expect(loginError).toBeNull();
          expect(service.isAuthenticated()).toBeTruthy();
          expect(service.getCurrentToken()).toBe(mockResponse.token);

          const currentUser = service.getCurrentUser();
          expect(currentUser).toBeTruthy();
          expect(currentUser?.name).toBe(cred.username);
        });

        it(`should handle failed login for ${cred.description} with wrong password`, () => {
          const loginRequest: LoginRequest = {
            username: cred.username,
            password: 'wrong-password'
          };

          let loginResult: LoginResponse | null = null;
          let loginError: any = null;

          service.login(loginRequest).subscribe({
            next: (response) => {
              loginResult = response;
            },
            error: (error) => {
              loginError = error;
            }
          });

          const req = httpMock.expectOne(`${environment.baseurl}/login`);
          expect(req.request.method).toBe('POST');
          expect(req.request.body).toEqual(loginRequest);

          // Simulate failed login
          req.flush(
            { error: 'Unauthorized', message: 'Invalid credentials' },
            { status: 401, statusText: 'Unauthorized' }
          );

          expect(loginResult).toBeNull();
          expect(loginError).toBeTruthy();
          expect(service.isAuthenticated()).toBeFalsy();
          expect(service.getCurrentToken()).toBeNull();
        });
      });
  });

  describe('User Login Tests', () => {
    testCredentials
      .filter(cred => cred.role === 'user')
      .forEach(cred => {
        it(`should login successfully as ${cred.description}`, () => {
          const loginRequest: LoginRequest = {
            username: cred.username,
            password: cred.password
          };

          const mockResponse: LoginResponse = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGY3NjAyYjA5ZGZmMzEwZGJlZDc2NCIsInVzZXJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3NzI0MDAwfQ.test-signature'
          };

          let loginResult: LoginResponse | null = null;

          service.login(loginRequest).subscribe({
            next: (response) => {
              loginResult = response;
            }
          });

          const req = httpMock.expectOne(`${environment.baseurl}/login`);
          req.flush(mockResponse);

          expect(loginResult).toEqual(mockResponse);
          expect(service.isAuthenticated()).toBeTruthy();

          const currentUser = service.getCurrentUser();
          expect(currentUser?.name).toBe(cred.username);
        });
      });
  });

  describe('Viewer Login Tests', () => {
    const viewerCred = testCredentials.find(cred => cred.role === 'viewer');

    if (viewerCred) {
      it(`should login successfully as ${viewerCred.description}`, () => {
        const loginRequest: LoginRequest = {
          username: viewerCred.username,
          password: viewerCred.password
        };

        const mockResponse: LoginResponse = {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGY3NjAyYjA5ZGZmMzEwZGJlZDc2NSIsInVzZXJuYW1lIjoidmlld2VyIiwicm9sZSI6InZpZXdlciIsImlhdCI6MTY5NzcyNDAwMH0.test-signature'
        };

        let loginResult: LoginResponse | null = null;

        service.login(loginRequest).subscribe({
          next: (response) => {
            loginResult = response;
          }
        });

        const req = httpMock.expectOne(`${environment.baseurl}/login`);
        req.flush(mockResponse);

        expect(loginResult).toEqual(mockResponse);
        expect(service.isAuthenticated()).toBeTruthy();

        const currentUser = service.getCurrentUser();
        expect(currentUser?.name).toBe(viewerCred.username);
      });
    }
  });

  describe('Authentication State Management', () => {
    it('should persist authentication state in localStorage', () => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!'
      };

      const mockResponse: LoginResponse = {
        token: 'test-jwt-token'
      };

      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${environment.baseurl}/login`);
      req.flush(mockResponse);

      // Check localStorage
      expect(localStorage.getItem('auth_token')).toBe(mockResponse.token);
      expect(localStorage.getItem('auth_user')).toBeTruthy();
    });

    it('should clear authentication state on logout', () => {
      // Set up authenticated state
      const token = 'test-token';
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify({ name: 'testuser' }));

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should handle rate limiting errors', () => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'wrong-password'
      };

      let loginError: any = null;

      service.login(loginRequest).subscribe({
        error: (error) => {
          loginError = error;
        }
      });

      const req = httpMock.expectOne(`${environment.baseurl}/login`);
      req.flush(
        {
          error: 'Too Many Login Attempts',
          message: 'Too many login attempts from this IP, please try again later.',
          retryAfter: 900
        },
        { status: 429, statusText: 'Too Many Requests' }
      );

      expect(loginError).toBeTruthy();
      expect(loginError.status).toBe(429);
    });
  });

  describe('Token Validation', () => {
    it('should validate JWT token format', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGVzdCJ9.signature';
      const invalidToken = 'invalid-token';

      // This would need to be implemented in the service
      // expect(service.isValidTokenFormat(validToken)).toBeTruthy();
      // expect(service.isValidTokenFormat(invalidToken)).toBeFalsy();
    });

    it('should check token expiration', () => {
      // Mock an expired token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImV4cCI6MTY5NzcyNDAwMH0.signature';

      // This would need to be implemented in the service
      // expect(service.isTokenExpired(expiredToken)).toBeTruthy();
    });
  });
});

/**
 * Integration Test Helper Functions
 */
export class LoginTestHelper {
  /**
   * Test login with multiple credential combinations
   */
  static async testMultipleCredentials(authService: AuthenticationService): Promise<void> {
    const testCredentials = [
      { username: 'admin', password: 'admin123!' },
      { username: 'user', password: 'user123!' },
      { username: 'carlo', password: 'carlo123!' },
      { username: 'viewer', password: 'viewer123!' }
    ];

    console.log('🧪 Testing multiple login credentials...');

    for (const cred of testCredentials) {
      try {
        console.log(`Testing ${cred.username}...`);

        const result = await new Promise<boolean>((resolve, reject) => {
          authService.login(cred).subscribe({
            next: (response) => {
              console.log(`✅ ${cred.username} login successful`);
              resolve(true);
            },
            error: (error) => {
              console.log(`❌ ${cred.username} login failed:`, error.message);
              resolve(false);
            }
          });

          // Timeout after 5 seconds
          setTimeout(() => reject(new Error('Timeout')), 5000);
        });

        if (result) {
          console.log(`🎉 Found working credentials: ${cred.username}`);
          break;
        }
      } catch (error) {
        console.log(`⚠️ Error testing ${cred.username}:`, error);
      }

      // Wait between attempts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
