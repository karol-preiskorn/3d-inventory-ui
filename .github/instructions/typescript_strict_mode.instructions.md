---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: "**/*.ts"
description: TypeScript Strict Mode Configuration for Angular UI
---

# TypeScript Strict Mode Configuration - Angular UI

This document provides detailed TypeScript strict mode configuration and enforcement guidelines specifically for the Angular UI project.

## Required Angular tsconfig.json Configuration

### Main TypeScript Configuration
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"],

    // Strict Mode Options (All Required)
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "strictInputTypes": true,
    "strictNullInputTypes": true,
    "strictAttributeTypes": true,
    "strictSafeNavigationTypes": true,
    "strictDomLocalRefTypes": true,
    "strictOutputEventTypes": true,
    "strictDomEventTypes": true,
    "strictContextGenerics": true,
    "strictLiteralTypes": true
  }
}
```

### Test Configuration (tsconfig.spec.json)
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "files": ["src/test-setup.ts"],
  "include": ["src/**/*.spec.ts", "src/**/*.test.ts", "src/**/*.d.ts"]
}
```

## Angular-Specific Strict Mode Patterns

### 1. Component Type Safety
```typescript
// ✅ CORRECT - Strict Angular component
@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceFormComponent implements OnInit, OnDestroy {
  // Explicit property types with initialization
  private readonly deviceService = inject(DeviceService)
  private readonly fb = inject(FormBuilder)
  private readonly destroy$ = new Subject<void>()

  // Input with strict typing
  @Input() deviceId: string | null = null

  // Output with explicit event type
  @Output() deviceSaved = new EventEmitter<Device>()

  // Form with typed form controls
  public readonly deviceForm: FormGroup<{
    name: FormControl<string>
    modelId: FormControl<string>
    position: FormGroup<{
      x: FormControl<number>
      y: FormControl<number>
    }>
  }> = this.createForm()

  // Signals with explicit types
  public loading = signal<boolean>(false)
  public error = signal<string | null>(null)
  public devices = signal<Device[]>([])

  // Lifecycle methods with explicit return types
  public ngOnInit(): void {
    if (this.deviceId) {
      this.loadDevice(this.deviceId)
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Private methods with explicit types
  private createForm(): FormGroup<{
    name: FormControl<string>
    modelId: FormControl<string>
    position: FormGroup<{
      x: FormControl<number>
      y: FormControl<number>
    }>
  }> {
    return this.fb.group({
      name: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true
      }),
      modelId: this.fb.control<string>('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      position: this.fb.group({
        x: this.fb.control<number>(0, { nonNullable: true }),
        y: this.fb.control<number>(0, { nonNullable: true })
      })
    })
  }

  private loadDevice(id: string): void {
    this.loading.set(true)

    this.deviceService.getDevice(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (device: Device | null) => {
          if (device) {
            this.populateForm(device)
          } else {
            this.error.set(`Device with ID ${id} not found`)
          }
          this.loading.set(false)
        },
        error: (error: Error) => {
          this.error.set(error.message)
          this.loading.set(false)
        }
      })
  }
}

// ❌ INCORRECT - Loose typing
@Component({...})
export class LooseComponent {
  deviceId: any              // Error: any type
  devices: any[]             // Error: any array
  form: FormGroup            // Missing generic type
  loading: boolean           // Should use signal

  ngOnInit() {               // Missing return type
    // Implementation
  }

  private loadData(id) {     // Error: implicit any parameter
    // Implementation
  }
}
```

### 2. Service Type Safety
```typescript
// ✅ CORRECT - Strict Angular service
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl: string = environment.apiUrl

  // Observable with explicit type
  private readonly devicesSubject = new BehaviorSubject<Device[]>([])
  public readonly devices$: Observable<Device[]> = this.devicesSubject.asObservable()

  // Methods with explicit parameter and return types
  public getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}/devices`)
      .pipe(
        tap((devices: Device[]) => this.devicesSubject.next(devices)),
        catchError((error: HttpErrorResponse) => this.handleError<Device[]>('getDevices', []))
      )
  }

  public getDevice(id: string): Observable<Device | null> {
    if (!id || typeof id !== 'string') {
      return throwError(() => new Error('Invalid device ID'))
    }

    return this.http.get<Device>(`${this.baseUrl}/devices/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null)
          }
          return this.handleError<Device>('getDevice', null)
        })
      )
  }

  public createDevice(deviceData: CreateDeviceRequest): Observable<Device> {
    return this.http.post<Device>(`${this.baseUrl}/devices`, deviceData)
      .pipe(
        tap((device: Device) => {
          const currentDevices = this.devicesSubject.value
          this.devicesSubject.next([...currentDevices, device])
        }),
        catchError((error: HttpErrorResponse) => this.handleError<Device>('createDevice'))
      )
  }

  public updateDevice(id: string, updates: Partial<Device>): Observable<Device> {
    return this.http.put<Device>(`${this.baseUrl}/devices/${id}`, updates)
      .pipe(
        tap((updatedDevice: Device) => {
          const currentDevices = this.devicesSubject.value
          const index = currentDevices.findIndex(d => d.id === id)
          if (index !== -1) {
            const newDevices = [...currentDevices]
            newDevices[index] = updatedDevice
            this.devicesSubject.next(newDevices)
          }
        }),
        catchError((error: HttpErrorResponse) => this.handleError<Device>('updateDevice'))
      )
  }

  public deleteDevice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/devices/${id}`)
      .pipe(
        tap(() => {
          const currentDevices = this.devicesSubject.value
          const filteredDevices = currentDevices.filter(d => d.id !== id)
          this.devicesSubject.next(filteredDevices)
        }),
        catchError((error: HttpErrorResponse) => this.handleError<void>('deleteDevice'))
      )
  }

  // Private helper with generic type
  private handleError<T>(operation: string, result?: T): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error)

      // Return safe result or throw error
      if (result !== undefined) {
        return of(result)
      }

      return throwError(() => new Error(`${operation} failed: ${error.message}`))
    }
  }
}

// ❌ INCORRECT - Loose service typing
@Injectable()
export class LooseService {
  getDevices() {                    // Missing return type
    return this.http.get('/devices') // Missing generic type
  }

  createDevice(data) {              // Error: implicit any parameter
    return this.http.post('/devices', data)
  }

  private handleError(operation, result) {  // Error: implicit any parameters
    return (error) => {                     // Error: implicit any parameter
      // Implementation
    }
  }
}
```

### 3. Template Type Safety
```html
<!-- ✅ CORRECT - Type-safe template -->
<div class="device-form">
  <form [formGroup]="deviceForm" (ngSubmit)="onSubmit()">
    <!-- Type-safe form controls -->
    <div class="form-group">
      <label for="device-name">Device Name</label>
      <input
        id="device-name"
        type="text"
        formControlName="name"
        [class.is-invalid]="deviceForm.get('name')?.invalid && deviceForm.get('name')?.touched"
        class="form-control">

      <!-- Type-safe error checking -->
      @if (deviceForm.get('name')?.hasError('required') && deviceForm.get('name')?.touched) {
        <div class="invalid-feedback">Device name is required</div>
      }

      @if (deviceForm.get('name')?.hasError('minlength') && deviceForm.get('name')?.touched) {
        <div class="invalid-feedback">
          Device name must be at least
          {{ deviceForm.get('name')?.getError('minlength')?.['requiredLength'] }} characters
        </div>
      }
    </div>

    <!-- Type-safe array iteration with trackBy -->
    @if (devices(); as deviceList) {
      <div class="device-list">
        @for (device of deviceList; track device.id; let i = $index) {
          <div class="device-item" [class.selected]="selectedDevice?.id === device.id">
            <span>{{ device.name }}</span>
            <button
              type="button"
              (click)="selectDevice(device)"
              [attr.aria-label]="'Select device ' + device.name">
              Select
            </button>
          </div>
        } @empty {
          <div class="no-devices">No devices available</div>
        }
      </div>
    }

    <!-- Type-safe loading and error states -->
    @if (loading()) {
      <div class="loading-spinner" role="status" aria-label="Loading devices">
        <span class="spinner"></span>
        Loading...
      </div>
    }

    @if (error(); as errorMessage) {
      <div class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
    }

    <!-- Type-safe button state -->
    <div class="form-actions">
      <button
        type="submit"
        [disabled]="deviceForm.invalid || loading()"
        class="btn btn-primary">
        @if (loading()) {
          <span class="spinner-border spinner-border-sm"></span>
          Saving...
        } @else {
          {{ deviceId ? 'Update' : 'Create' }} Device
        }
      </button>
    </div>
  </form>
</div>
```

### 4. Route Guards with Type Safety
```typescript
// ✅ CORRECT - Strict route guard
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthenticationService)
  private readonly router = inject(Router)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.authState$.pipe(
      map((authState: AuthState) => {
        if (authState.isAuthenticated) {
          // Check role-based permissions
          const requiredRole = route.data['requiredRole'] as UserRole | undefined

          if (requiredRole && authState.user) {
            const hasPermission = this.checkRolePermission(authState.user.role, requiredRole)
            if (!hasPermission) {
              return this.router.createUrlTree(['/unauthorized'])
            }
          }

          return true
        } else {
          // Store attempted URL for redirect after login
          const returnUrl: string = state.url
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl }
          })
        }
      }),
      take(1)
    )
  }

  private checkRolePermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      'viewer': 1,
      'user': 2,
      'admin': 3
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }
}

// ❌ INCORRECT - Loose guard typing
@Injectable()
export class LooseGuard implements CanActivate {
  canActivate(route, state) {  // Error: implicit any parameters
    // Implementation without proper typing
  }
}
```

### 5. Interceptors with Type Safety
```typescript
// ✅ CORRECT - Strict HTTP interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthenticationService)

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return this.authService.authState$.pipe(
      take(1),
      switchMap((authState: AuthState) => {
        // Clone request with auth headers if authenticated
        let authRequest: HttpRequest<any> = request

        if (authState.isAuthenticated && authState.token) {
          authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.token}`,
              'Content-Type': 'application/json'
            }
          })
        }

        return next.handle(authRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Handle unauthorized error
              this.authService.logout()
              return throwError(() => new Error('Unauthorized access'))
            }

            return throwError(() => error)
          })
        )
      })
    )
  }
}

// ❌ INCORRECT - Loose interceptor
@Injectable()
export class LooseInterceptor implements HttpInterceptor {
  intercept(req, next) {  // Error: implicit any parameters
    // Implementation without proper typing
  }
}
```

## Angular Template Strict Mode

### Strict Template Configuration
```json
{
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInputTypes": true,
    "strictNullInputTypes": true,
    "strictAttributeTypes": true,
    "strictSafeNavigationTypes": true,
    "strictDomLocalRefTypes": true,
    "strictOutputEventTypes": true,
    "strictDomEventTypes": true,
    "strictContextGenerics": true,
    "strictLiteralTypes": true
  }
}
```

### Template Type Safety Examples
```html
<!-- ✅ CORRECT - Strict template typing -->
<app-device-card
  [device]="selectedDevice"
  [readonly]="isReadonly"
  (deviceUpdated)="onDeviceUpdated($event)"
  (deviceDeleted)="onDeviceDeleted($event)">
</app-device-card>

<!-- Type-safe event binding -->
<button
  type="button"
  (click)="handleClick($event)"
  [disabled]="loading()">
  Click Me
</button>

<!-- Safe navigation with proper typing -->
<div>
  {{ user?.profile?.displayName ?? 'Unknown User' }}
</div>

<!-- Type-safe pipe usage -->
<div>
  {{ createdDate | date:'short' }}
  {{ deviceCount | number:'1.0-0' }} devices
</div>

<!-- ❌ INCORRECT - Template errors with strict mode -->
<app-device-card
  [device]="invalidProperty"          <!-- Error: Property doesn't exist -->
  [readonly]="stringValue"            <!-- Error: Type mismatch -->
  (unknownEvent)="handler($event)">   <!-- Error: Event doesn't exist -->
</app-device-card>
```

## Build and Validation Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration=production",
    "type:check": "ng build --dry-run",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "validate": "npm run type:check && npm run lint && npm run test"
  }
}
```

### Quality Gates
```bash
#!/bin/sh
# .husky/pre-commit - Angular specific
echo "🔍 Running Angular type checking..."
npm run type:check

if [ $? -ne 0 ]; then
  echo "❌ Angular compilation failed. Fix TypeScript errors."
  exit 1
fi

echo "🔍 Running Angular linting..."
npm run lint

if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Fix code style issues."
  exit 1
fi

echo "✅ All Angular quality checks passed."
```

This configuration ensures 100% TypeScript strict mode compliance specifically for Angular applications, providing type safety for components, services, templates, and all Angular-specific patterns.
