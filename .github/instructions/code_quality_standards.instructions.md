---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: "**"
description: Code Quality Standards for 3D Inventory Angular UI
---

# Code Quality Standards - 3D Inventory Angular UI

This document defines the comprehensive code quality standards that must be applied to all code in the 3D Inventory Angular UI project.

## 1. TypeScript Strict Mode Compliance

### Requirement: 100% Type Safety Compliance

#### Angular TypeScript Configuration Standards
- **Strict Mode**: All TypeScript files must compile with Angular strict mode enabled
- **Angular Strict Templates**: Template type checking enabled
- **No Any Types**: Avoid `any` type usage; use proper Angular and TypeScript types
- **Explicit Component Types**: All component properties and methods must be explicitly typed

#### Implementation Guidelines
```typescript
// ✅ CORRECT - Angular component with explicit types
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  private readonly destroy$ = new Subject<void>()

  users$: Observable<User[]> = this.userService.getUsers()
  selectedUser: User | null = null
  loading = signal<boolean>(false)

  ngOnInit(): void {
    this.loadUsers()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onUserSelect(user: User): void {
    this.selectedUser = user
    this.router.navigate(['/users', user.id])
  }
}

// ❌ INCORRECT - Any types and missing type annotations
@Component({...})
export class UserListComponent {
  users: any
  selectedUser: any

  onUserSelect(user) {
    // Missing types and error handling
  }
}
```

#### Angular-Specific Type Requirements
- **Component Interfaces**: Implement Angular lifecycle interfaces
- **Service Injection**: Use Angular's inject() function with proper types
- **Observable Types**: Explicitly type all RxJS observables
- **Form Types**: Use Angular's typed reactive forms
- **HTTP Client**: Type all HTTP requests and responses

```typescript
// Required Angular type patterns
export interface UserFormData {
  username: string
  email: string
  role: UserRole
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = environment.apiUrl

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`)
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, userData)
  }

  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, userData)
  }
}
```

## 2. ESLint Rules - Angular-Specific Code Style and Quality

### Angular ESLint Configuration Requirements

#### Mandatory Angular ESLint Rules
```typescript
// eslint.config.js requirements for Angular
export default [
  {
    files: ['**/*.ts'],
    extends: [
      '@angular-eslint/recommended',
      '@angular-eslint/template/process-inline-templates'
    ],
    rules: {
      // Angular-specific rules
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-explicit-any': 'error',

      // RxJS rules
      'rxjs/no-exposed-subjects': 'error',
      'rxjs/no-unbound-methods': 'error',
      'rxjs/no-unsafe-takeuntil': 'error'
    }
  },
  {
    files: ['**/*.html'],
    extends: ['@angular-eslint/template/recommended'],
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/use-track-by-function': 'error'
    }
  }
]
```

#### Angular Component Standards
```typescript
// ✅ CORRECT - Angular component structure
@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceFormComponent implements OnInit, OnDestroy {
  private readonly deviceService = inject(DeviceService)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  public readonly deviceForm: FormGroup<DeviceFormControls> = this.createForm()
  public loading = signal<boolean>(false)
  public error = signal<string | null>(null)

  @Input() public deviceId: string | null = null
  @Output() public deviceSaved = new EventEmitter<Device>()

  public ngOnInit(): void {
    if (this.deviceId) {
      this.loadDevice(this.deviceId)
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public onSubmit(): void {
    if (this.deviceForm.valid) {
      this.saveDevice()
    }
  }

  private createForm(): FormGroup<DeviceFormControls> {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      modelId: ['', Validators.required],
      position: this.fb.group({
        x: [0, Validators.required],
        y: [0, Validators.required]
      })
    })
  }
}
```

#### Template Standards
```html
<!-- ✅ CORRECT - Angular template structure -->
<form [formGroup]="deviceForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <label for="device-name">Device Name</label>
    <input
      id="device-name"
      type="text"
      formControlName="name"
      [class.is-invalid]="deviceForm.get('name')?.invalid && deviceForm.get('name')?.touched"
      class="form-control">

    @if (deviceForm.get('name')?.hasError('required') && deviceForm.get('name')?.touched) {
      <div class="invalid-feedback">Device name is required</div>
    }

    @if (deviceForm.get('name')?.hasError('minlength') && deviceForm.get('name')?.touched) {
      <div class="invalid-feedback">Device name must be at least 3 characters</div>
    }
  </div>

  <div class="form-actions">
    <button type="submit" [disabled]="deviceForm.invalid || loading()" class="btn btn-primary">
      @if (loading()) {
        <span class="spinner-border spinner-border-sm" role="status"></span>
        Saving...
      } @else {
        Save Device
      }
    </button>
  </div>
</form>
```

## 3. Test Coverage - Angular-Specific Testing Standards

### Requirement: Minimum 80% Test Coverage

#### Angular Testing Configuration
```typescript
// jest.config.ts for Angular
export default {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 85,
      lines: 80
    }
  }
}
```

#### Angular Component Testing Standards
```typescript
// Required Angular component test structure
describe('DeviceFormComponent', () => {
  let component: DeviceFormComponent
  let fixture: ComponentFixture<DeviceFormComponent>
  let deviceService: jasmine.SpyObj<DeviceService>

  beforeEach(async () => {
    const deviceServiceSpy = jasmine.createSpyObj('DeviceService', ['getDevice', 'createDevice', 'updateDevice'])

    await TestBed.configureTestingModule({
      imports: [DeviceFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: DeviceService, useValue: deviceServiceSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(DeviceFormComponent)
    component = fixture.componentInstance
    deviceService = TestBed.inject(DeviceService) as jasmine.SpyObj<DeviceService>
  })

  describe('Component Initialization', () => {
    it('should create component with valid form', () => {
      expect(component).toBeTruthy()
      expect(component.deviceForm).toBeDefined()
      expect(component.deviceForm.valid).toBeFalsy()
    })

    it('should load device data when deviceId is provided', () => {
      const mockDevice: Device = createMockDevice()
      deviceService.getDevice.and.returnValue(of(mockDevice))

      component.deviceId = 'test-id'
      component.ngOnInit()

      expect(deviceService.getDevice).toHaveBeenCalledWith('test-id')
      expect(component.deviceForm.get('name')?.value).toBe(mockDevice.name)
    })
  })

  describe('Form Validation', () => {
    it('should require device name', () => {
      const nameControl = component.deviceForm.get('name')
      nameControl?.setValue('')
      nameControl?.markAsTouched()

      expect(nameControl?.hasError('required')).toBeTruthy()
      expect(component.deviceForm.valid).toBeFalsy()
    })

    it('should validate minimum name length', () => {
      const nameControl = component.deviceForm.get('name')
      nameControl?.setValue('ab')
      nameControl?.markAsTouched()

      expect(nameControl?.hasError('minlength')).toBeTruthy()
    })
  })

  describe('Form Submission', () => {
    it('should create device when form is valid', () => {
      const mockDevice: Device = createMockDevice()
      deviceService.createDevice.and.returnValue(of(mockDevice))

      fillValidForm(component.deviceForm)
      component.onSubmit()

      expect(deviceService.createDevice).toHaveBeenCalled()
      expect(component.deviceSaved.emit).toHaveBeenCalledWith(mockDevice)
    })

    it('should not submit when form is invalid', () => {
      component.deviceForm.get('name')?.setValue('')
      component.onSubmit()

      expect(deviceService.createDevice).not.toHaveBeenCalled()
    })
  })
})
```

#### Angular Service Testing Standards
```typescript
describe('AuthenticationService', () => {
  let service: AuthenticationService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    })

    service = TestBed.inject(AuthenticationService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  describe('login', () => {
    it('should login successfully and update auth state', () => {
      const loginRequest: LoginRequest = { username: 'testuser' }
      const mockResponse: LoginResponse = {
        token: 'mock.jwt.token',
        user: { id: '1', username: 'testuser', role: 'user' }
      }

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockResponse)
        expect(service.isAuthenticated()).toBeTruthy()
        expect(service.getCurrentUser()).toEqual(mockResponse.user)
      })

      const req = httpMock.expectOne(`${environment.apiUrl}/login`)
      expect(req.request.method).toBe('POST')
      expect(req.request.body).toEqual(loginRequest)
      req.flush(mockResponse)
    })

    it('should handle login errors gracefully', () => {
      const loginRequest: LoginRequest = { username: 'invalid' }
      const errorResponse = { message: 'Invalid credentials' }

      service.login(loginRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Invalid credentials')
          expect(service.isAuthenticated()).toBeFalsy()
        }
      })

      const req = httpMock.expectOne(`${environment.apiUrl}/login`)
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' })
    })
  })
})
```

## 4. Documentation Standards - Angular-Specific

### Angular Component Documentation
```typescript
/**
 * Device Form Component
 *
 * Provides a reactive form for creating and editing device information.
 * Supports both create and edit modes based on the deviceId input.
 *
 * Features:
 * - Reactive form validation with custom validators
 * - Real-time form validation feedback
 * - Loading states and error handling
 * - Accessibility compliance with proper ARIA labels
 *
 * Dependencies:
 * - DeviceService: For CRUD operations
 * - FormBuilder: For reactive form construction
 * - Router: For navigation after successful operations
 *
 * @example
 * ```html
 * <!-- Create mode -->
 * <app-device-form (deviceSaved)="onDeviceSaved($event)"></app-device-form>
 *
 * <!-- Edit mode -->
 * <app-device-form
 *   [deviceId]="selectedDeviceId"
 *   (deviceSaved)="onDeviceUpdated($event)">
 * </app-device-form>
 * ```
 */
@Component({
  selector: 'app-device-form',
  // ... component configuration
})
export class DeviceFormComponent implements OnInit, OnDestroy {
  /**
   * Device ID for edit mode. When provided, component loads existing device data.
   * @default null - Creates new device
   */
  @Input() public deviceId: string | null = null

  /**
   * Emitted when device is successfully saved (created or updated)
   * @event deviceSaved - Emits the saved device object
   */
  @Output() public deviceSaved = new EventEmitter<Device>()

  /**
   * Reactive form for device data input and validation
   * Contains nested form groups for complex data structures
   */
  public readonly deviceForm: FormGroup<DeviceFormControls> = this.createForm()

  /**
   * Loading state signal for async operations
   * Used to disable form and show loading indicators
   */
  public loading = signal<boolean>(false)
}
```

### Angular Service Documentation
```typescript
/**
 * Authentication Service
 *
 * Manages user authentication state and JWT token handling.
 * Provides reactive state management using BehaviorSubject patterns.
 *
 * Features:
 * - JWT token management with automatic refresh
 * - Reactive authentication state
 * - Role-based access control helpers
 * - Automatic logout on token expiration
 * - Local storage persistence
 *
 * Security Considerations:
 * - Tokens stored in httpOnly cookies when possible
 * - Automatic token refresh before expiration
 * - Secure logout with server-side token invalidation
 *
 * @example
 * ```typescript
 * constructor(private auth: AuthenticationService) {
 *   // Subscribe to auth state changes
 *   this.auth.authState$.subscribe(state => {
 *     if (state.isAuthenticated) {
 *       console.log('User logged in:', state.user.username)
 *     }
 *   })
 * }
 *
 * // Login user
 * this.auth.login({ username: 'user', password: 'pass' })
 *   .subscribe(response => {
 *     // Handle successful login
 *   })
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  /**
   * Observable authentication state stream
   * Emits current authentication status and user information
   */
  public readonly authState$: Observable<AuthState> = this.authStateSubject.asObservable()

  /**
   * Authenticates user with username/password credentials
   *
   * @param credentials - User login credentials
   * @returns Observable<LoginResponse> - Contains JWT token and user info
   * @throws {HttpErrorResponse} When credentials are invalid or server error occurs
   */
  public login(credentials: LoginRequest): Observable<LoginResponse> {
    // Implementation
  }
}
```

## 5. Angular-Specific Quality Gates

### Angular Build Configuration
```json
// angular.json quality settings
{
  "projects": {
    "3d-inventory-angular-ui": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
        },
        "lint": {
          "builder": "@angular-eslint/builder:lint",
          "options": {
            "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
          }
        }
      }
    }
  }
}
```

### Angular Testing Scripts
```json
// package.json testing scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "build:prod": "ng build --configuration=production",
    "build:analyze": "ng build --configuration=production --stats-json && npx webpack-bundle-analyzer dist/*/stats.json"
  }
}
```

## 6. Angular Performance Standards

### Bundle Size Requirements
- **Initial Bundle**: Maximum 2MB warning, 5MB error
- **Lazy Loaded Modules**: Maximum 500KB per module
- **Vendor Bundle**: Separate vendor chunk optimization

### Angular Performance Patterns
```typescript
// ✅ CORRECT - OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class OptimizedComponent {
  // Use signals for reactive updates
  data = signal<Data[]>([])

  // TrackBy functions for *ngFor
  trackByDeviceId(index: number, device: Device): string {
    return device.id
  }
}
```

```html
<!-- ✅ CORRECT - Performance optimized template -->
<div *ngFor="let device of devices; trackBy: trackByDeviceId">
  {{ device.name }}
</div>

<!-- Lazy loading with loading states -->
@if (loading()) {
  <app-loading-spinner></app-loading-spinner>
} @else {
  <app-device-list [devices]="devices()"></app-device-list>
}
```

## 7. Angular Accessibility Standards

### ARIA and Accessibility Requirements
```html
<!-- ✅ CORRECT - Accessible form -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()" role="form">
  <div class="form-group">
    <label for="username" class="form-label">
      Username
      <span class="required" aria-label="required">*</span>
    </label>
    <input
      id="username"
      type="text"
      formControlName="username"
      class="form-control"
      aria-describedby="username-help username-error"
      [attr.aria-invalid]="userForm.get('username')?.invalid && userForm.get('username')?.touched">

    <div id="username-help" class="form-text">
      Enter your unique username
    </div>

    @if (userForm.get('username')?.hasError('required') && userForm.get('username')?.touched) {
      <div id="username-error" class="invalid-feedback" role="alert">
        Username is required
      </div>
    }
  </div>
</form>
```

## 8. Angular Security Standards

### XSS Prevention
```typescript
// ✅ CORRECT - Safe HTML rendering
@Component({
  template: `
    <!-- Safe interpolation -->
    <div>{{ userInput }}</div>

    <!-- Safe property binding -->
    <div [textContent]="userInput"></div>

    <!-- Sanitized HTML when necessary -->
    <div [innerHTML]="sanitizedHtml"></div>
  `
})
export class SafeComponent {
  constructor(private sanitizer: DomSanitizer) {}

  get sanitizedHtml(): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.rawHtml) || ''
  }
}
```

### HTTP Security
```typescript
// ✅ CORRECT - Secure HTTP interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add CSRF token
    const csrfToken = this.getCsrfToken()
    const secureReq = req.clone({
      setHeaders: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    })

    return next.handle(secureReq)
  }
}
```

---

## Implementation Checklist

- [ ] Angular strict mode enabled in tsconfig.json
- [ ] Angular ESLint configuration with all required rules
- [ ] Jest testing framework configured for Angular
- [ ] Test coverage meets 80% minimum across all metrics
- [ ] All components use OnPush change detection strategy
- [ ] Reactive forms with proper validation implemented
- [ ] Services use proper dependency injection patterns
- [ ] Templates follow accessibility guidelines
- [ ] Bundle size optimization configured
- [ ] Security headers and CSRF protection enabled
- [ ] Performance monitoring and budgets configured

**Angular Version**: Ensure compatibility with Angular 17+ features
**Standalone Components**: Prefer standalone components over NgModule architecture
**Signals**: Use Angular signals for reactive state management where appropriate
**Control Flow**: Use new Angular control flow syntax (@if, @for, @switch)

This comprehensive quality standard ensures the Angular UI maintains high code quality, performance, and security standards while following modern Angular best practices.
