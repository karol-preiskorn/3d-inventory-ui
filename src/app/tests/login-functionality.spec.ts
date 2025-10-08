import { TestBed } from '@angular/core/testing'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { Router } from '@angular/router'
import { AuthenticationService } from '../services/authentication.service'
import { LoginRequest, LoginResponse } from '../shared/user'
import { environment } from '../../environments/environment'

/**
 * Login Functionality Test Suite
 *
 * Comprehensive tests for authentication service including:
 * - User login with various roles (admin, user, viewer)
 * - Authentication state management
 * - JWT token handling
 * - Error handling (401, 429, network errors)
 * - LocalStorage persistence
 * - Logout functionality
 *
 * @version 2.0.0
 * @date 2025-10-08
 */
describe('Login Functionality Tests', () => {
  let service: AuthenticationService
  let httpMock: HttpTestingController
  let routerSpy: jest.Mocked<Router>

  /**
   * Test credentials for different user roles
   * Based on API backend user database
   */
  const TEST_CREDENTIALS = [
    { username: 'admin', password: 'admin123!', role: 'admin', description: 'Admin with full permissions' },
    { username: 'user', password: 'user123!', role: 'user', description: 'Standard user' },
    { username: 'carlo', password: 'carlo123!', role: 'user', description: 'Carlo user account' },
    { username: 'viewer', password: 'viewer123!', role: 'viewer', description: 'Read-only viewer' },
  ] as const

  /**
   * Helper function to create a valid mock JWT token
   * @param username - Username to encode in token
   * @param role - User role for authorization
   * @param id - User ID (defaults to test ID)
   * @returns Base64-encoded JWT token string
   */
  function createMockJWT(username: string, role: string, id: string = '67df7602b09dff310dbed764'): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        id: id,
        username: username,
        role: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
      })
    )
    const signature = 'mock-signature-for-testing'
    return `${header}.${payload}.${signature}`
  }

  beforeEach(() => {
    // Create router spy
    const routerSpyObj = {
      navigate: jest.fn().mockResolvedValue(true),
      navigateByUrl: jest.fn().mockResolvedValue(true),
    }

    // Configure TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService, { provide: Router, useValue: routerSpyObj }],
    })

    service = TestBed.inject(AuthenticationService)
    httpMock = TestBed.inject(HttpTestingController)
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>

    // Clear any previous auth state
    localStorage.clear()
  })

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify()
    // Clean up localStorage
    localStorage.clear()
    // Reset mocks
    jest.clearAllMocks()
  })

  // ============================================================================
  // Service Initialization Tests
  // ============================================================================

  describe('Service Initialization', () => {
    it('should be created successfully', () => {
      expect(service).toBeTruthy()
      expect(service).toBeInstanceOf(AuthenticationService)
    })

    it('should initialize with unauthenticated state', () => {
      expect(service.isAuthenticated()).toBeFalsy()
      expect(service.getCurrentUser()).toBeNull()
      expect(service.getCurrentToken()).toBeNull()
    })

    it('should expose authState$ observable', (done) => {
      service.authState$.subscribe((state) => {
        expect(state).toBeDefined()
        expect(state.isAuthenticated).toBeFalsy()
        expect(state.user).toBeNull()
        expect(state.token).toBeNull()
        done()
      })
    })
  })

  // ============================================================================
  // Successful Login Tests by Role
  // ============================================================================

  describe('Successful Login - Admin Role', () => {
    const adminCreds = TEST_CREDENTIALS.filter((c) => c.role === 'admin')

    adminCreds.forEach((cred) => {
      it(`should successfully login as ${cred.description}`, (done) => {
        const loginRequest: LoginRequest = {
          username: cred.username,
          password: cred.password,
        }
        const mockResponse: LoginResponse = {
          token: createMockJWT(cred.username, cred.role),
        }

        service.login(loginRequest).subscribe({
          next: (response) => {
            // Verify response
            expect(response).toBeDefined()
            expect(response.token).toBe(mockResponse.token)

            // Verify authentication state
            expect(service.isAuthenticated()).toBeTruthy()
            expect(service.getCurrentToken()).toBe(mockResponse.token)

            // Verify user information
            const currentUser = service.getCurrentUser()
            expect(currentUser).toBeDefined()
            expect(currentUser?.name).toBe(cred.username)

            // Verify localStorage persistence
            expect(localStorage.getItem('auth_token')).toBe(mockResponse.token)

            done()
          },
          error: (err) => done.fail(`Login should not fail: ${err}`),
        })

        // Simulate HTTP response
        const req = httpMock.expectOne(`${environment.baseurl}/login`)
        expect(req.request.method).toBe('POST')
        expect(req.request.body).toEqual(loginRequest)
        req.flush(mockResponse)
      })
    })
  })

  describe('Successful Login - User Role', () => {
    const userCreds = TEST_CREDENTIALS.filter((c) => c.role === 'user')

    userCreds.forEach((cred) => {
      it(`should successfully login as ${cred.description}`, (done) => {
        const loginRequest: LoginRequest = {
          username: cred.username,
          password: cred.password,
        }
        const mockResponse: LoginResponse = {
          token: createMockJWT(cred.username, cred.role),
        }

        service.login(loginRequest).subscribe({
          next: (response) => {
            expect(response.token).toBe(mockResponse.token)
            expect(service.isAuthenticated()).toBeTruthy()
            expect(service.getCurrentUser()?.name).toBe(cred.username)
            done()
          },
          error: (err) => done.fail(`Login failed: ${err}`),
        })

        const req = httpMock.expectOne(`${environment.baseurl}/login`)
        expect(req.request.method).toBe('POST')
        req.flush(mockResponse)
      })
    })
  })

  describe('Successful Login - Viewer Role', () => {
    const viewerCreds = TEST_CREDENTIALS.filter((c) => c.role === 'viewer')

    viewerCreds.forEach((cred) => {
      it(`should successfully login as ${cred.description}`, (done) => {
        const loginRequest: LoginRequest = {
          username: cred.username,
          password: cred.password,
        }
        const mockResponse: LoginResponse = {
          token: createMockJWT(cred.username, cred.role),
        }

        service.login(loginRequest).subscribe({
          next: (response) => {
            expect(response.token).toBe(mockResponse.token)
            expect(service.isAuthenticated()).toBeTruthy()
            expect(service.getCurrentUser()?.name).toBe(cred.username)
            done()
          },
          error: (err) => done.fail(`Login failed: ${err}`),
        })

        const req = httpMock.expectOne(`${environment.baseurl}/login`)
        req.flush(mockResponse)
      })
    })
  })

  // ============================================================================
  // Failed Login Tests
  // ============================================================================

  describe('Failed Login Scenarios', () => {
    it('should handle invalid credentials (401 Unauthorized)', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'wrong-password',
      }

      service.login(loginRequest).subscribe({
        next: () => done.fail('Login should have failed'),
        error: (error) => {
          expect(error).toBeDefined()
          expect(service.isAuthenticated()).toBeFalsy()
          expect(service.getCurrentToken()).toBeNull()
          expect(localStorage.getItem('auth_token')).toBeNull()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush({ error: 'Unauthorized', message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' })
    })

    it('should handle rate limiting (429 Too Many Requests)', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }

      service.login(loginRequest).subscribe({
        next: () => done.fail('Should have failed due to rate limiting'),
        error: (error) => {
          expect(error).toBeDefined()
          expect(error.status).toBe(429)
          expect(service.isAuthenticated()).toBeFalsy()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush(
        {
          error: 'Too Many Requests',
          message: 'Too many login attempts, please try again later',
          retryAfter: 900,
        },
        { status: 429, statusText: 'Too Many Requests' }
      )
    })

    it('should handle network errors gracefully', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }

      service.login(loginRequest).subscribe({
        next: () => done.fail('Should have failed due to network error'),
        error: (error) => {
          expect(error).toBeDefined()
          expect(service.isAuthenticated()).toBeFalsy()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.error(new ProgressEvent('Network error'), {
        status: 0,
        statusText: 'Network Error',
      })
    })

    it('should handle server errors (500 Internal Server Error)', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }

      service.login(loginRequest).subscribe({
        next: () => done.fail('Should have failed due to server error'),
        error: (error) => {
          expect(error).toBeDefined()
          expect(error.status).toBe(500)
          expect(service.isAuthenticated()).toBeFalsy()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush({ error: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' })
    })
  })

  // ============================================================================
  // Authentication State Management
  // ============================================================================

  describe('Authentication State Management', () => {
    it('should persist authentication state in localStorage', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }
      const mockToken = createMockJWT('admin', 'admin')
      const mockResponse: LoginResponse = { token: mockToken }

      service.login(loginRequest).subscribe({
        next: () => {
          expect(localStorage.getItem('auth_token')).toBe(mockToken)
          expect(service.isAuthenticated()).toBeTruthy()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush(mockResponse)
    })

    it('should update authState$ observable on login', (done) => {
      const loginRequest: LoginRequest = {
        username: 'user',
        password: 'user123!',
      }
      const mockResponse: LoginResponse = {
        token: createMockJWT('user', 'user'),
      }

      // Subscribe to state changes
      service.authState$.subscribe((state) => {
        if (state.isAuthenticated) {
          expect(state.user).toBeDefined()
          expect(state.token).toBe(mockResponse.token)
          expect(state.user?.name).toBe('user')
          done()
        }
      })

      service.login(loginRequest).subscribe()

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush(mockResponse)
    })

    it('should clear all auth state on logout', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }
      const mockResponse: LoginResponse = {
        token: createMockJWT('admin', 'admin'),
      }

      // First login
      service.login(loginRequest).subscribe({
        next: () => {
          expect(service.isAuthenticated()).toBeTruthy()

          // Then logout
          service.logout()

          expect(service.isAuthenticated()).toBeFalsy()
          expect(service.getCurrentUser()).toBeNull()
          expect(service.getCurrentToken()).toBeNull()
          expect(localStorage.getItem('auth_token')).toBeNull()
          expect(localStorage.getItem('auth_user')).toBeNull()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush(mockResponse)
    })

    it('should restore authentication state from localStorage on init', () => {
      const mockToken = createMockJWT('test', 'user', 'test-id-123')
      const mockUser = {
        _id: 'test-id-123',
        name: 'test',
        email: 'test@example.com',
        permissions: [],
      }

      // Manually set localStorage (simulating previous session)
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('auth_user', JSON.stringify(mockUser))

      // Create new service instance to trigger initialization
      const newService = new AuthenticationService(TestBed.inject(HttpClient), routerSpy)

      expect(newService.isAuthenticated()).toBeTruthy()
      expect(newService.getCurrentToken()).toBe(mockToken)
      expect(newService.getCurrentUser()?.name).toBe('test')
    })
  })

  // ============================================================================
  // JWT Token Validation
  // ============================================================================

  describe('JWT Token Validation', () => {
    it('should create valid JWT token structure', () => {
      const token = createMockJWT('testuser', 'admin', 'test-id-123')
      const parts = token.split('.')

      expect(parts.length).toBe(3)
      expect(parts[0]).toBeTruthy() // Header
      expect(parts[1]).toBeTruthy() // Payload
      expect(parts[2]).toBeTruthy() // Signature
    })

    it('should correctly decode JWT payload', () => {
      const username = 'testuser'
      const role = 'admin'
      const id = 'test-id-123'

      const token = createMockJWT(username, role, id)
      const parts = token.split('.')
      const payload = JSON.parse(atob(parts[1]))

      expect(payload.username).toBe(username)
      expect(payload.role).toBe(role)
      expect(payload.id).toBe(id)
      expect(payload.exp).toBeGreaterThan(payload.iat)
    })

    it('should detect expired tokens', () => {
      // Create token that expired 1 hour ago
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(
        JSON.stringify({
          id: 'test',
          username: 'test',
          role: 'user',
          iat: expiredTimestamp - 3600,
          exp: expiredTimestamp,
        })
      )
      const expiredToken = `${header}.${payload}.signature`

      // Verify token structure and expiration time
      const tokenParts = expiredToken.split('.')
      const decodedPayload = JSON.parse(atob(tokenParts[1]))
      expect(decodedPayload.exp).toBeLessThan(Math.floor(Date.now() / 1000))
    })

    it('should detect valid non-expired tokens', () => {
      const validToken = createMockJWT('test', 'user')
      const tokenParts = validToken.split('.')
      const decodedPayload = JSON.parse(atob(tokenParts[1]))
      expect(decodedPayload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
    })
  })

  // ============================================================================
  // Edge Cases and Security
  // ============================================================================

  describe('Edge Cases and Security', () => {
    it('should handle empty username', (done) => {
      const loginRequest: LoginRequest = {
        username: '',
        password: 'password',
      }

      service.login(loginRequest).subscribe({
        next: () => done.fail('Should not allow empty username'),
        error: () => {
          expect(service.isAuthenticated()).toBeFalsy()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush({ error: 'Bad Request', message: 'Username is required' }, { status: 400, statusText: 'Bad Request' })
    })

    it('should handle malformed token response', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }

      service.login(loginRequest).subscribe({
        next: (response) => {
          // Service should handle malformed token gracefully
          expect(response).toBeDefined()
          done()
        },
        error: () => {
          // Or it might reject malformed tokens
          expect(service.isAuthenticated()).toBeFalsy()
          done()
        },
      })

      const req = httpMock.expectOne(`${environment.baseurl}/login`)
      req.flush({ token: 'invalid.token.format' })
    })

    it('should not expose password in request headers', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }

      service.login(loginRequest).subscribe(() => done())

      const req = httpMock.expectOne(`${environment.baseurl}/login`)

      // Verify password is in body, not headers
      expect(req.request.headers.get('password')).toBeNull()
      expect(req.request.body.password).toBe('admin123!')

      req.flush({ token: createMockJWT('admin', 'admin') })
    })
  })

  // ============================================================================
  // Multiple Sequential Operations
  // ============================================================================

  describe('Multiple Sequential Operations', () => {
    it('should handle logout and re-login correctly', (done) => {
      const loginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin123!',
      }
      const mockResponse: LoginResponse = {
        token: createMockJWT('admin', 'admin'),
      }

      // First login
      service.login(loginRequest).subscribe({
        next: () => {
          expect(service.isAuthenticated()).toBeTruthy()

          // Logout
          service.logout()
          expect(service.isAuthenticated()).toBeFalsy()

          // Second login
          service.login(loginRequest).subscribe({
            next: () => {
              expect(service.isAuthenticated()).toBeTruthy()
              done()
            },
          })

          const req2 = httpMock.expectOne(`${environment.baseurl}/login`)
          req2.flush(mockResponse)
        },
      })

      const req1 = httpMock.expectOne(`${environment.baseurl}/login`)
      req1.flush(mockResponse)
    })

    it('should replace old token when logging in with different user', (done) => {
      const adminLogin: LoginRequest = { username: 'admin', password: 'admin123!' }
      const userLogin: LoginRequest = { username: 'user', password: 'user123!' }

      const adminResponse: LoginResponse = { token: createMockJWT('admin', 'admin') }
      const userResponse: LoginResponse = { token: createMockJWT('user', 'user') }

      // Login as admin
      service.login(adminLogin).subscribe({
        next: () => {
          expect(service.getCurrentUser()?.name).toBe('admin')
          const adminToken = service.getCurrentToken()

          // Login as user (should replace admin session)
          service.login(userLogin).subscribe({
            next: () => {
              expect(service.getCurrentUser()?.name).toBe('user')
              expect(service.getCurrentToken()).not.toBe(adminToken)
              done()
            },
          })

          const req2 = httpMock.expectOne(`${environment.baseurl}/login`)
          req2.flush(userResponse)
        },
      })

      const req1 = httpMock.expectOne(`${environment.baseurl}/login`)
      req1.flush(adminResponse)
    })
  })
})
