# GitHub Copilot Instructions

This file provides context and instructions for GitHub Copilot to assist with development in the 3D Inventory Angular UI project.

## Project Overview

This is a **3D Inventory Management System Angular UI** built with Angular 17+ using standalone components. The application provides a modern web interface for managing 3D inventory data, including devices, models, connections, attributes, and user management.

### Key Technologies
- **Angular 17+** with standalone components
- **TypeScript** with strict mode
- **Bootstrap 5.3+** for UI components
- **Three.js** for 3D visualization
- **RxJS** for reactive programming
- **Jest** for testing
- **SCSS** for styling

## Project Structure

```
src/
├── app/
│   ├── components/          # Angular standalone components
│   │   ├── admin/          # Admin layout and management
│   │   ├── auth/           # Authentication components
│   │   ├── devices/        # Device management
│   │   ├── models/         # 3D model management
│   │   ├── connections/    # Connection management
│   │   ├── users/          # User management
│   │   └── 3d/            # 3D visualization components
│   ├── services/           # Angular services
│   ├── shared/            # Shared interfaces and utilities
│   ├── guards/            # Route guards
│   ├── features/          # Feature modules
│   └── testing/           # Test utilities
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## Development Guidelines

### Component Development

#### Standalone Components (Preferred)
Always use Angular 17+ standalone component architecture:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent implements OnInit, OnDestroy {
  // Component implementation
}
```

#### Change Detection Strategy
- Use `OnPush` change detection strategy for performance
- Inject `ChangeDetectorRef` when manual change detection is needed
- Use immutable data patterns with OnPush

#### Component Structure
```typescript
export class ComponentExample implements OnInit, OnDestroy {
  // Signals (Angular 17+)
  private destroy$ = new Subject<void>();

  // Form controls
  form = this.fb.group({
    // form definition
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private service: ServiceName
  ) {}

  ngOnInit(): void {
    // Initialization logic
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Service Development

#### HTTP Services
Create services that interact with the 3D Inventory API:

```typescript
@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  private readonly API_URL = environment.baseurl;

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.API_URL}/items`);
  }

  createItem(item: CreateItemRequest): Observable<Item> {
    return this.http.post<Item>(`${this.API_URL}/items`, item);
  }
}
```

#### State Management
Use BehaviorSubject for reactive state management:

```typescript
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private stateSubject = new BehaviorSubject<State>(initialState);
  public state$ = this.stateSubject.asObservable();

  updateState(newState: Partial<State>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...newState
    });
  }
}
```

### Forms and Validation

#### Reactive Forms (Preferred)
Always use reactive forms with proper validation:

```typescript
createForm(): FormGroup {
  return this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });
}

hasFieldError(field: string): boolean {
  const control = this.form.get(field);
  return !!(control && control.invalid && (control.dirty || control.touched));
}

getFieldError(field: string): string {
  const control = this.form.get(field);
  if (control?.errors) {
    if (control.errors['required']) return `${field} is required`;
    if (control.errors['email']) return 'Please enter a valid email';
    if (control.errors['minlength']) return `${field} must be at least ${control.errors['minlength'].requiredLength} characters`;
  }
  return '';
}
```

### Template Patterns

#### Angular Control Flow (Angular 17+)
Use new control flow syntax:

```html
<!-- Conditional rendering -->
@if (isAuthenticated) {
  <app-dashboard></app-dashboard>
} @else {
  <app-login></app-login>
}

<!-- Loops -->
@for (item of items; track item.id) {
  <div class="item">{{ item.name }}</div>
} @empty {
  <div class="no-items">No items found</div>
}

<!-- Switch statements -->
@switch (userRole) {
  @case ('admin') {
    <app-admin-panel></app-admin-panel>
  }
  @case ('user') {
    <app-user-panel></app-user-panel>
  }
  @default {
    <app-guest-panel></app-guest-panel>
  }
}
```

#### Bootstrap Integration
Use Bootstrap classes with Angular:

```html
<div class="container-fluid">
  <div class="row">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <h5><i class="bi bi-icon"></i> Title</h5>
        </div>
        <div class="card-body">
          <!-- Content -->
        </div>
      </div>
    </div>
  </div>
</div>
```

### Testing Patterns

#### Component Testing
Use Jest with Angular TestBed:

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let serviceSpy: jasmine.SpyObj<ServiceName>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

    await TestBed.configureTestingModule({
      imports: [ComponentName, ReactiveFormsModule],
      providers: [
        { provide: ServiceName, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(ServiceName) as jasmine.SpyObj<ServiceName>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

#### Service Testing
Test HTTP services with MockHttpClient:

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName]
    });

    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data successfully', () => {
    const mockData = [{ id: 1, name: 'Test' }];

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

### Routing and Navigation

#### Route Configuration
Use lazy loading for feature modules:

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'devices',
    loadChildren: () => import('./features/devices/devices.routes').then(m => m.routes)
  }
];
```

#### Route Guards
Implement authentication and authorization guards:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
```

### API Integration

#### Environment Configuration
Use environment files for API configuration:

```typescript
// environment.ts
export const environment = {
  production: false,
  baseurl: 'https://3d-inventory-api.ultimasolution.pl'
};
```

#### HTTP Client Usage
Integrate with 3D Inventory API:

```typescript
// API endpoints follow this pattern:
// GET    /devices - List all devices
// GET    /devices/:id - Get device by ID
// POST   /devices - Create new device
// PUT    /devices/:id - Update device
// DELETE /devices/:id - Delete device

getDevices(): Observable<Device[]> {
  return this.http.get<Device[]>(`${this.API_URL}/devices`);
}

getDevice(id: string): Observable<Device> {
  return this.http.get<Device>(`${this.API_URL}/devices/${id}`);
}
```

### 3D Visualization

#### Three.js Integration
For 3D components, use Three.js:

```typescript
@Component({
  selector: 'app-3d-viewer',
  standalone: true,
  templateUrl: './3d-viewer.component.html',
  styleUrls: ['./3d-viewer.component.scss']
})
export class ThreeDViewerComponent implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  ngOnInit(): void {
    this.initThreeJS();
    this.loadModel();
  }

  private initThreeJS(): void {
    // Three.js initialization
  }
}
```

### Error Handling

#### Global Error Handler
Implement comprehensive error handling:

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error:', error);

    // Send to logging service
    // Show user-friendly message
    // Navigate to error page if needed
  }
}
```

#### HTTP Error Handling
Handle API errors gracefully:

```typescript
private handleError = (error: HttpErrorResponse): Observable<never> => {
  let errorMessage = 'An unknown error occurred';

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = error.error.message;
  } else {
    // Server-side error
    errorMessage = error.error?.message || `Error Code: ${error.status}`;
  }

  return throwError(() => new Error(errorMessage));
};
```

### Performance Optimization

#### OnPush Change Detection
```typescript
// Use OnPush strategy with proper immutable updates
updateData(newItem: Item): void {
  this.items = [...this.items, newItem];
  this.cdr.detectChanges();
}
```

#### Lazy Loading
```typescript
// Implement lazy loading for routes
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.routes').then(m => m.routes)
  }
];
```

### Authentication Patterns

#### JWT Token Management
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.updateAuthState(response);
          }
        })
      );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
}
```

## Code Style and Conventions

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Angular Guidelines
- Use Angular CLI for generating components and services
- Follow Angular style guide conventions
- Use dependency injection properly
- Implement OnDestroy for cleanup

### SCSS Guidelines
- Use Bootstrap variables and mixins
- Organize styles with BEM methodology
- Keep component styles scoped
- Use CSS custom properties for theming

## Common Patterns

### Loading States
```typescript
export class ComponentWithLoading {
  loading = false;

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      const data = await this.service.getData().toPromise();
      this.processData(data);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
```

### Form Submission
```typescript
async onSubmit(): Promise<void> {
  if (this.form.valid) {
    this.loading = true;
    try {
      const result = await this.service.create(this.form.value).toPromise();
      this.router.navigate(['/success']);
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }
}
```

## Build and Deployment

### Development Commands
```bash
npm start              # Start development server
npm run build         # Build for production
npm run test          # Run unit tests
npm run lint          # Run linting
npm run build:analyze # Analyze bundle size
```

### Environment Setup
- Development: `http://localhost:4200`
- API: `https://3d-inventory-api.ultimasolution.pl`
- Production builds are deployed to Google Cloud Platform

## Accessibility

### ARIA Labels and Roles
```html
<button
  type="button"
  [attr.aria-expanded]="isExpanded"
  [attr.aria-controls]="panelId"
  class="btn btn-primary">
  Toggle Panel
</button>

<div
  [id]="panelId"
  [attr.aria-hidden]="!isExpanded"
  role="region">
  Panel content
</div>
```

### Form Accessibility
```html
<label for="username" class="form-label">Username</label>
<input
  id="username"
  type="text"
  formControlName="username"
  [attr.aria-describedby]="hasFieldError('username') ? 'username-error' : null"
  [attr.aria-invalid]="hasFieldError('username')"
  class="form-control">

@if (hasFieldError('username')) {
  <div id="username-error" class="invalid-feedback" role="alert">
    {{ getFieldError('username') }}
  </div>
}
```

## Security Considerations

### XSS Prevention
- Always use Angular's built-in sanitization
- Use `[innerHTML]` with caution
- Validate all user inputs

### CSRF Protection
- Angular's HttpClient automatically handles CSRF tokens
- Ensure API endpoints are properly configured

### Authentication
- Store JWT tokens securely
- Implement proper token refresh
- Use HTTPS in production

---

When generating code, please follow these patterns and conventions to maintain consistency with the existing codebase.
