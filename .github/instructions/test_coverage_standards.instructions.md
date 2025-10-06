---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: "**/*.spec.ts,**/*.test.ts"
description: Angular-Specific Test Coverage Standards and Requirements
---

# Test Coverage Standards - Angular UI Project

This document defines comprehensive test coverage standards specifically for the Angular UI project in the 3D Inventory system.

## Angular Testing Framework Configuration

### Jest Configuration for Angular
```typescript
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['<rootDir>/src/app/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/index.ts',
    '!src/app/**/*.d.ts',
    '!src/app/testing/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov', 'json'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 85,
      lines: 80
    },
    'src/app/services/': {
      statements: 90,
      branches: 80,
      functions: 95,
      lines: 90
    },
    'src/app/guards/': {
      statements: 100,
      branches: 85,
      functions: 100,
      lines: 100
    },
    'src/app/components/': {
      statements: 85,
      branches: 75,
      functions: 90,
      lines: 85
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  }
}

export default config
```

### Test Setup Configuration
```typescript
// src/test-setup.ts
import 'jest-preset-angular/setup-jest'
import { ngMocks } from 'ng-mocks'

// Global test configuration
Object.defineProperty(window, 'CSS', { value: null })
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance']
  })
})

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 1
})

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 1
})

// NgMocks global configuration
ngMocks.autoSpy('jest')
ngMocks.defaultMock(HttpClient, () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn()
}))
```

## Angular Component Testing Standards

### 1. Standalone Component Testing
```typescript
/**
 * Angular Component Test Standards
 *
 * Requirements:
 * - Test component initialization and lifecycle
 * - Test input/output properties and events
 * - Test template rendering and user interactions
 * - Test form validation and submission
 * - Mock all service dependencies
 */

describe('DeviceFormComponent', () => {
  let component: DeviceFormComponent
  let fixture: ComponentFixture<DeviceFormComponent>
  let deviceService: jasmine.SpyObj<DeviceService>
  let router: jasmine.SpyObj<Router>

  beforeEach(async () => {
    // Create service spies with proper typing
    const deviceServiceSpy = jasmine.createSpyObj('DeviceService', [
      'getDevice',
      'createDevice',
      'updateDevice',
      'getModels'
    ])

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      imports: [
        DeviceFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule
      ],
      providers: [
        { provide: DeviceService, useValue: deviceServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceFormComponent)
    component = fixture.componentInstance
    deviceService = TestBed.inject(DeviceService) as jasmine.SpyObj<DeviceService>
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>
  })

  describe('Component Initialization', () => {
    it('should create component with valid initial state', () => {
      expect(component).toBeTruthy()
      expect(component.deviceForm).toBeDefined()
      expect(component.loading()).toBeFalsy()
      expect(component.error()).toBeNull()
    })

    it('should initialize form with default values', () => {
      fixture.detectChanges()

      expect(component.deviceForm.get('name')?.value).toBe('')
      expect(component.deviceForm.get('modelId')?.value).toBe('')
      expect(component.deviceForm.get('position.x')?.value).toBe(0)
      expect(component.deviceForm.get('position.y')?.value).toBe(0)
      expect(component.deviceForm.valid).toBeFalsy()
    })

    it('should load device data when deviceId input is provided', fakeAsync(() => {
      // Arrange
      const mockDevice: Device = {
        id: 'test-device-id',
        name: 'Test Device',
        modelId: 'test-model-id',
        position: { x: 10, y: 20, h: 1 },
        attributes: []
      }

      deviceService.getDevice.and.returnValue(of(mockDevice))
      component.deviceId = 'test-device-id'

      // Act
      component.ngOnInit()
      tick()
      fixture.detectChanges()

      // Assert
      expect(deviceService.getDevice).toHaveBeenCalledWith('test-device-id')
      expect(component.deviceForm.get('name')?.value).toBe(mockDevice.name)
      expect(component.deviceForm.get('modelId')?.value).toBe(mockDevice.modelId)
      expect(component.deviceForm.get('position.x')?.value).toBe(mockDevice.position.x)
      expect(component.deviceForm.get('position.y')?.value).toBe(mockDevice.position.y)
    }))

    it('should handle device loading error', fakeAsync(() => {
      // Arrange
      const errorMessage = 'Device not found'
      deviceService.getDevice.and.returnValue(throwError(() => new Error(errorMessage)))
      component.deviceId = 'invalid-id'

      // Act
      component.ngOnInit()
      tick()
      fixture.detectChanges()

      // Assert
      expect(component.error()).toBe(errorMessage)
      expect(component.loading()).toBeFalsy()
    }))
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it('should validate required device name', () => {
      const nameControl = component.deviceForm.get('name')

      // Test empty name
      nameControl?.setValue('')
      nameControl?.markAsTouched()
      fixture.detectChanges()

      expect(nameControl?.hasError('required')).toBeTruthy()
      expect(component.deviceForm.valid).toBeFalsy()

      // Test valid name
      nameControl?.setValue('Valid Device Name')
      fixture.detectChanges()

      expect(nameControl?.hasError('required')).toBeFalsy()
    })

    it('should validate minimum name length', () => {
      const nameControl = component.deviceForm.get('name')

      nameControl?.setValue('ab') // Less than 3 characters
      nameControl?.markAsTouched()
      fixture.detectChanges()

      expect(nameControl?.hasError('minlength')).toBeTruthy()
      expect(component.deviceForm.valid).toBeFalsy()

      nameControl?.setValue('abc') // Exactly 3 characters
      fixture.detectChanges()

      expect(nameControl?.hasError('minlength')).toBeFalsy()
    })

    it('should validate required model selection', () => {
      const modelControl = component.deviceForm.get('modelId')

      modelControl?.setValue('')
      modelControl?.markAsTouched()
      fixture.detectChanges()

      expect(modelControl?.hasError('required')).toBeTruthy()
      expect(component.deviceForm.valid).toBeFalsy()
    })

    it('should validate position coordinates', () => {
      const xControl = component.deviceForm.get('position.x')
      const yControl = component.deviceForm.get('position.y')

      // Test negative coordinates
      xControl?.setValue(-1)
      yControl?.setValue(-1)
      fixture.detectChanges()

      expect(xControl?.hasError('min')).toBeTruthy()
      expect(yControl?.hasError('min')).toBeTruthy()

      // Test valid coordinates
      xControl?.setValue(10)
      yControl?.setValue(20)
      fixture.detectChanges()

      expect(xControl?.hasError('min')).toBeFalsy()
      expect(yControl?.hasError('min')).toBeFalsy()
    })

    // Test custom validators
    it('should validate unique device name', fakeAsync(() => {
      deviceService.getDevice.and.returnValue(of({} as Device)) // Device exists

      const nameControl = component.deviceForm.get('name')
      nameControl?.setValue('Existing Device')
      nameControl?.markAsTouched()

      tick(300) // Debounce time for async validator
      fixture.detectChanges()

      expect(nameControl?.hasError('nameExists')).toBeTruthy()
    }))
  })

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges()
      // Set up valid form data
      component.deviceForm.patchValue({
        name: 'Test Device',
        modelId: 'test-model-id',
        position: { x: 10, y: 20 }
      })
    })

    it('should create device when form is valid and deviceId is null', fakeAsync(() => {
      // Arrange
      const mockCreatedDevice: Device = {
        id: 'new-device-id',
        name: 'Test Device',
        modelId: 'test-model-id',
        position: { x: 10, y: 20, h: 1 },
        attributes: []
      }

      deviceService.createDevice.and.returnValue(of(mockCreatedDevice))
      spyOn(component.deviceSaved, 'emit')

      // Act
      component.onSubmit()
      tick()
      fixture.detectChanges()

      // Assert
      expect(deviceService.createDevice).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Test Device',
          modelId: 'test-model-id',
          position: { x: 10, y: 20 }
        })
      )
      expect(component.deviceSaved.emit).toHaveBeenCalledWith(mockCreatedDevice)
      expect(component.loading()).toBeFalsy()
    }))

    it('should update device when form is valid and deviceId is provided', fakeAsync(() => {
      // Arrange
      const mockUpdatedDevice: Device = {
        id: 'existing-device-id',
        name: 'Updated Device',
        modelId: 'test-model-id',
        position: { x: 15, y: 25, h: 1 },
        attributes: []
      }

      component.deviceId = 'existing-device-id'
      component.deviceForm.patchValue({ name: 'Updated Device', position: { x: 15, y: 25 } })

      deviceService.updateDevice.and.returnValue(of(mockUpdatedDevice))
      spyOn(component.deviceSaved, 'emit')

      // Act
      component.onSubmit()
      tick()
      fixture.detectChanges()

      // Assert
      expect(deviceService.updateDevice).toHaveBeenCalledWith(
        'existing-device-id',
        jasmine.objectContaining({
          name: 'Updated Device',
          position: { x: 15, y: 25 }
        })
      )
      expect(component.deviceSaved.emit).toHaveBeenCalledWith(mockUpdatedDevice)
    }))

    it('should not submit when form is invalid', () => {
      // Arrange - make form invalid
      component.deviceForm.patchValue({ name: '' })

      // Act
      component.onSubmit()

      // Assert
      expect(deviceService.createDevice).not.toHaveBeenCalled()
      expect(deviceService.updateDevice).not.toHaveBeenCalled()
    })

    it('should handle submission errors', fakeAsync(() => {
      // Arrange
      const errorMessage = 'Failed to save device'
      deviceService.createDevice.and.returnValue(throwError(() => new Error(errorMessage)))

      // Act
      component.onSubmit()
      tick()
      fixture.detectChanges()

      // Assert
      expect(component.error()).toBe(errorMessage)
      expect(component.loading()).toBeFalsy()
    }))
  })

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it('should display form fields correctly', () => {
      const compiled = fixture.nativeElement

      expect(compiled.querySelector('input[formControlName="name"]')).toBeTruthy()
      expect(compiled.querySelector('select[formControlName="modelId"]')).toBeTruthy()
      expect(compiled.querySelector('input[formControlName="position.x"]')).toBeTruthy()
      expect(compiled.querySelector('input[formControlName="position.y"]')).toBeTruthy()
    })

    it('should show validation errors in template', () => {
      const nameInput = fixture.debugElement.query(By.css('input[formControlName="name"]'))
      const nameControl = component.deviceForm.get('name')

      // Trigger validation error
      nameControl?.setValue('')
      nameControl?.markAsTouched()
      fixture.detectChanges()

      const errorElement = fixture.debugElement.query(By.css('.invalid-feedback'))
      expect(errorElement.nativeElement.textContent).toContain('Device name is required')
    })

    it('should disable submit button when form is invalid', () => {
      component.deviceForm.patchValue({ name: '' }) // Make form invalid
      fixture.detectChanges()

      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'))
      expect(submitButton.nativeElement.disabled).toBeTruthy()
    })

    it('should show loading state during submission', () => {
      component.loading.set(true)
      fixture.detectChanges()

      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'))
      const spinner = fixture.debugElement.query(By.css('.spinner-border'))

      expect(submitButton.nativeElement.disabled).toBeTruthy()
      expect(spinner).toBeTruthy()
    })

    it('should display error messages', () => {
      const errorMessage = 'Test error message'
      component.error.set(errorMessage)
      fixture.detectChanges()

      const errorElement = fixture.debugElement.query(By.css('.alert-danger'))
      expect(errorElement.nativeElement.textContent).toContain(errorMessage)
    })
  })

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      spyOn(component['destroy$'], 'next')
      spyOn(component['destroy$'], 'complete')

      component.ngOnDestroy()

      expect(component['destroy$'].next).toHaveBeenCalled()
      expect(component['destroy$'].complete).toHaveBeenCalled()
    })
  })
})
```

### 2. Angular Service Testing Standards
```typescript
/**
 * Angular Service Test Standards
 *
 * Requirements:
 * - Test HTTP client interactions with proper mocking
 * - Test error handling and retry logic
 * - Test observable streams and state management
 * - Test caching and data transformation
 */

describe('DeviceService', () => {
  let service: DeviceService
  let httpMock: HttpTestingController
  let authService: jasmine.SpyObj<AuthenticationService>

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getToken'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DeviceService,
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    })

    service = TestBed.inject(DeviceService)
    httpMock = TestBed.inject(HttpTestingController)
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>
  })

  afterEach(() => {
    httpMock.verify()
  })

  describe('getDevices', () => {
    it('should retrieve devices from API', () => {
      // Arrange
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'Device 1',
          modelId: 'model-1',
          position: { x: 0, y: 0, h: 1 },
          attributes: []
        },
        {
          id: '2',
          name: 'Device 2',
          modelId: 'model-2',
          position: { x: 10, y: 10, h: 1 },
          attributes: []
        }
      ]

      // Act
      service.getDevices().subscribe(devices => {
        // Assert
        expect(devices).toEqual(mockDevices)
        expect(devices.length).toBe(2)
      })

      // Assert HTTP request
      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      expect(req.request.method).toBe('GET')
      req.flush(mockDevices)
    })

    it('should handle HTTP errors gracefully', () => {
      // Act
      service.getDevices().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toContain('Failed to load devices')
        }
      })

      // Simulate HTTP error
      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      })
    })

    it('should cache devices data', () => {
      const mockDevices: Device[] = [/* mock data */]

      // First call
      service.getDevices().subscribe()
      const req1 = httpMock.expectOne(`${environment.apiUrl}/devices`)
      req1.flush(mockDevices)

      // Second call should use cached data
      service.getDevices().subscribe(devices => {
        expect(devices).toEqual(mockDevices)
      })

      // Should not make another HTTP request
      httpMock.expectNone(`${environment.apiUrl}/devices`)
    })

    it('should update internal devices subject', () => {
      const mockDevices: Device[] = [/* mock data */]

      service.devices$.subscribe(devices => {
        if (devices.length > 0) {
          expect(devices).toEqual(mockDevices)
        }
      })

      service.getDevices().subscribe()
      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      req.flush(mockDevices)
    })
  })

  describe('getDevice', () => {
    it('should retrieve single device by ID', () => {
      const deviceId = 'test-device-id'
      const mockDevice: Device = {
        id: deviceId,
        name: 'Test Device',
        modelId: 'test-model',
        position: { x: 5, y: 5, h: 1 },
        attributes: [{ key: 'test', value: 'value' }]
      }

      service.getDevice(deviceId).subscribe(device => {
        expect(device).toEqual(mockDevice)
      })

      const req = httpMock.expectOne(`${environment.apiUrl}/devices/${deviceId}`)
      expect(req.request.method).toBe('GET')
      req.flush(mockDevice)
    })

    it('should return null for non-existent device', () => {
      const deviceId = 'non-existent-id'

      service.getDevice(deviceId).subscribe(device => {
        expect(device).toBeNull()
      })

      const req = httpMock.expectOne(`${environment.apiUrl}/devices/${deviceId}`)
      req.flush('Not Found', { status: 404, statusText: 'Not Found' })
    })

    it('should throw error for invalid device ID', () => {
      service.getDevice('').subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toContain('Invalid device ID')
        }
      })

      httpMock.expectNone(`${environment.apiUrl}/devices/`)
    })
  })

  describe('createDevice', () => {
    it('should create new device', () => {
      const deviceData: CreateDeviceRequest = {
        name: 'New Device',
        modelId: 'test-model',
        position: { x: 0, y: 0 }
      }

      const mockCreatedDevice: Device = {
        id: 'new-device-id',
        ...deviceData,
        position: { ...deviceData.position, h: 1 },
        attributes: []
      }

      service.createDevice(deviceData).subscribe(device => {
        expect(device).toEqual(mockCreatedDevice)
      })

      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      expect(req.request.method).toBe('POST')
      expect(req.request.body).toEqual(deviceData)
      req.flush(mockCreatedDevice)
    })

    it('should update devices list after creation', () => {
      const deviceData: CreateDeviceRequest = {
        name: 'New Device',
        modelId: 'test-model',
        position: { x: 0, y: 0 }
      }

      const mockCreatedDevice: Device = {
        id: 'new-device-id',
        ...deviceData,
        position: { ...deviceData.position, h: 1 },
        attributes: []
      }

      // Subscribe to devices stream
      let devicesCount = 0
      service.devices$.subscribe(devices => {
        if (devices.length > devicesCount) {
          devicesCount = devices.length
          expect(devices).toContain(jasmine.objectContaining({ id: 'new-device-id' }))
        }
      })

      service.createDevice(deviceData).subscribe()
      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      req.flush(mockCreatedDevice)
    })

    it('should handle validation errors', () => {
      const invalidDeviceData = {
        name: '', // Invalid - empty name
        modelId: 'test-model',
        position: { x: 0, y: 0 }
      }

      service.createDevice(invalidDeviceData as CreateDeviceRequest).subscribe({
        next: () => fail('Should have failed with validation error'),
        error: (error) => {
          expect(error.status).toBe(400)
        }
      })

      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      req.flush({ message: 'Validation failed' }, {
        status: 400,
        statusText: 'Bad Request'
      })
    })
  })

  describe('Error Handling and Retry Logic', () => {
    it('should retry failed requests up to 3 times', () => {
      let attemptCount = 0

      service.getDevices().subscribe({
        next: () => fail('Should have failed after retries'),
        error: (error) => {
          expect(attemptCount).toBe(3) // Initial + 2 retries
        }
      })

      // Expect 3 requests (initial + 2 retries)
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
        attemptCount++
        req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' })
      }
    })

    it('should not retry on 4xx client errors', () => {
      service.getDevices().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404)
        }
      })

      // Should only make one request for client errors
      const req = httpMock.expectOne(`${environment.apiUrl}/devices`)
      req.flush('Not Found', { status: 404, statusText: 'Not Found' })
    })
  })

  describe('State Management', () => {
    it('should maintain consistent state across operations', fakeAsync(() => {
      const initialDevices: Device[] = [
        { id: '1', name: 'Device 1', modelId: 'model-1', position: { x: 0, y: 0, h: 1 }, attributes: [] }
      ]

      // Load initial devices
      service.getDevices().subscribe()
      const getReq = httpMock.expectOne(`${environment.apiUrl}/devices`)
      getReq.flush(initialDevices)
      tick()

      // Create new device
      const newDevice: CreateDeviceRequest = {
        name: 'Device 2',
        modelId: 'model-2',
        position: { x: 10, y: 10 }
      }

      const createdDevice: Device = {
        id: '2',
        ...newDevice,
        position: { ...newDevice.position, h: 1 },
        attributes: []
      }

      service.createDevice(newDevice).subscribe()
      const createReq = httpMock.expectOne(`${environment.apiUrl}/devices`)
      createReq.flush(createdDevice)
      tick()

      // Verify state is updated
      service.devices$.subscribe(devices => {
        expect(devices.length).toBe(2)
        expect(devices).toContain(jasmine.objectContaining({ id: '1' }))
        expect(devices).toContain(jasmine.objectContaining({ id: '2' }))
      })

      // Delete device
      service.deleteDevice('1').subscribe()
      const deleteReq = httpMock.expectOne(`${environment.apiUrl}/devices/1`)
      deleteReq.flush({})
      tick()

      // Verify state is updated after deletion
      service.devices$.subscribe(devices => {
        expect(devices.length).toBe(1)
        expect(devices).toContain(jasmine.objectContaining({ id: '2' }))
        expect(devices).not.toContain(jasmine.objectContaining({ id: '1' }))
      })
    }))
  })
})
```

### 3. Angular Guards Testing Standards
```typescript
describe('AuthGuard', () => {
  let guard: AuthGuard
  let authService: jasmine.SpyObj<AuthenticationService>
  let router: jasmine.SpyObj<Router>

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', [], {
      authState$: of({ isAuthenticated: true, user: { role: 'user' } })
    })
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree'])

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })

    guard = TestBed.inject(AuthGuard)
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>
  })

  it('should allow access for authenticated users', (done) => {
    const route = { data: {} } as ActivatedRouteSnapshot
    const state = { url: '/dashboard' } as RouterStateSnapshot

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBe(true)
      done()
    })
  })

  it('should redirect to login for unauthenticated users', (done) => {
    const authStateSubject = new BehaviorSubject({ isAuthenticated: false, user: null })
    authService.authState$ = authStateSubject.asObservable()

    const expectedUrlTree = {} as UrlTree
    router.createUrlTree.and.returnValue(expectedUrlTree)

    const route = { data: {} } as ActivatedRouteSnapshot
    const state = { url: '/dashboard' } as RouterStateSnapshot

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBe(expectedUrlTree)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/dashboard' }
      })
      done()
    })
  })

  it('should check role-based permissions', (done) => {
    const authStateSubject = new BehaviorSubject({
      isAuthenticated: true,
      user: { role: 'user' }
    })
    authService.authState$ = authStateSubject.asObservable()

    const route = { data: { requiredRole: 'admin' } } as ActivatedRouteSnapshot
    const state = { url: '/admin' } as RouterStateSnapshot

    const expectedUrlTree = {} as UrlTree
    router.createUrlTree.and.returnValue(expectedUrlTree)

    guard.canActivate(route, state).subscribe(result => {
      expect(result).toBe(expectedUrlTree)
      expect(router.createUrlTree).toHaveBeenCalledWith(['/unauthorized'])
      done()
    })
  })
})
```

## Test Data Management for Angular

### Angular Test Utilities
```typescript
// src/app/testing/test-utils.ts
export class AngularTestUtils {
  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      id: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      ...overrides
    }
  }

  static createMockDevice(overrides: Partial<Device> = {}): Device {
    return {
      id: 'test-device-id',
      name: 'Test Device',
      modelId: 'test-model-id',
      position: { x: 0, y: 0, h: 1 },
      attributes: [],
      ...overrides
    }
  }

  static createMockAuthState(overrides: Partial<AuthState> = {}): AuthState {
    return {
      isAuthenticated: true,
      user: this.createMockUser(),
      token: 'mock.jwt.token',
      ...overrides
    }
  }

  static fillFormField(fixture: ComponentFixture<any>, selector: string, value: any): void {
    const element = fixture.debugElement.query(By.css(selector))
    if (element) {
      element.nativeElement.value = value
      element.nativeElement.dispatchEvent(new Event('input'))
      fixture.detectChanges()
    }
  }

  static clickButton(fixture: ComponentFixture<any>, selector: string): void {
    const button = fixture.debugElement.query(By.css(selector))
    if (button) {
      button.nativeElement.click()
      fixture.detectChanges()
    }
  }

  static expectFormError(fixture: ComponentFixture<any>, fieldName: string, errorType: string): void {
    const errorElement = fixture.debugElement.query(
      By.css(`[data-test="${fieldName}-${errorType}-error"]`)
    )
    expect(errorElement).toBeTruthy()
  }
}
```

This comprehensive Angular testing standard ensures high-quality, maintainable test suites specifically for Angular applications with proper component testing, service testing, and integration testing patterns.
