import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginRequest, LoginResponse } from '../../shared/user';
import { generateTestPassword } from '../../testing/test-utils';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['login', 'isAuthenticated']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Default mocks
    authServiceSpy.isAuthenticated.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if already authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should set return URL from query params', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.queryParams = { returnUrl: '/admin/dashboard' };

    component.ngOnInit();

    expect(component.returnUrl).toBe('/admin/dashboard');
  });

  it('should use default return URL if none provided', () => {
    component.ngOnInit();

    expect(component.returnUrl).toBe('/admin/users');
  });

  it('should validate required username', () => {
    component.loginForm.patchValue({ username: '' });
    component.loginForm.get('username')?.markAsTouched();

    expect(component.hasFieldError('username')).toBeTruthy();
    expect(component.getFieldError('username')).toContain('required');
  });

  it('should validate minimum username length', () => {
    component.loginForm.patchValue({ username: 'a' });
    component.loginForm.get('username')?.markAsTouched();

    expect(component.hasFieldError('username')).toBeTruthy();
    expect(component.getFieldError('username')).toContain('at least 2 characters');
  });

  it('should not submit invalid form', () => {
    component.loginForm.patchValue({ username: '' });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.loginForm.get('username')?.touched).toBeTruthy();
  });

  it('should login successfully with username only', () => {
    const mockResponse: LoginResponse = { token: 'mock-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({ username: 'carlo' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'carlo' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/users']);
    expect(component.loading).toBeFalsy();
  });

  it('should login successfully with username and password', () => {
    const mockResponse: LoginResponse = { token: 'mock-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    const testPassword = generateTestPassword();
    component.loginForm.patchValue({
      username: 'carlo',
      password: testPassword
    });
    component.onSubmit();

    const expectedRequest: LoginRequest = {
      username: 'carlo',
      password: testPassword
    };

    expect(authServiceSpy.login).toHaveBeenCalledWith(expectedRequest);
  });

  it('should handle login error', () => {
    const errorMessage = 'Invalid credentials';
    authServiceSpy.login.and.returnValue(throwError(() => new Error(errorMessage)));

    component.loginForm.patchValue({ username: 'invalid' });
    component.onSubmit();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalsy();
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should navigate to custom return URL after login', () => {
    component.returnUrl = '/admin/dashboard';
    const mockResponse: LoginResponse = { token: 'mock-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({ username: 'carlo' });
    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should clear error message', () => {
    component.error = 'Test error';

    component.clearError();

    expect(component.error).toBeNull();
  });

  it('should handle Enter key press', () => {
    spyOn(component, 'onSubmit');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });

    component.onKeyPress(event);

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should not submit on Enter when loading', () => {
    spyOn(component, 'onSubmit');
    component.loading = true;
    const event = new KeyboardEvent('keypress', { key: 'Enter' });

    component.onKeyPress(event);

    expect(component.onSubmit).not.toHaveBeenCalled();
  });

  it('should navigate to home page', () => {
    component.goToHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should trim whitespace from username', () => {
    const mockResponse: LoginResponse = { token: 'mock-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({ username: '  carlo  ' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'carlo' });
  });

  it('should not include empty password in request', () => {
    const mockResponse: LoginResponse = { token: 'mock-token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'carlo',
      password: '   '  // Just whitespace
    });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'carlo' });
  });

  it('should get correct field display names', () => {
    expect(component['getFieldDisplayName']('username')).toBe('Username');
    expect(component['getFieldDisplayName']('password')).toBe('Password');
    expect(component['getFieldDisplayName']('unknown')).toBe('unknown');
  });

  it('should mark all fields as touched when form is invalid', () => {
    component.loginForm.patchValue({ username: '' });

    component.onSubmit();

    expect(component.loginForm.get('username')?.touched).toBeTruthy();
    expect(component.loginForm.get('password')?.touched).toBeTruthy();
  });
});
