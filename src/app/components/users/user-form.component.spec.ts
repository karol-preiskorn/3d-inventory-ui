import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Permission, User } from '../../shared/user';
import { generateTestPassword } from '../../testing/test-utils';

// eslint-disable-next-line max-lines-per-function
describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let _authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    permissions: [Permission.USER_READ, Permission.DEVICE_READ]
  };

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'getUserById',
      'createUser',
      'updateUser',
      'getAvailablePermissions',
      'getPredefinedRoles',
      'getPermissionsForRole'
    ]);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy('get').and.returnValue(null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    _authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Set up default mocks
    userServiceSpy.getAvailablePermissions.and.returnValue(Object.values(Permission));
    userServiceSpy.getPredefinedRoles.and.returnValue([]);
    userServiceSpy.getPermissionsForRole.and.returnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode when no ID provided', () => {
    component.ngOnInit();

    expect(component.isEditMode).toBeFalsy();
    expect(component.userId).toBeNull();
    expect(component.userForm.get('password')?.hasError('required')).toBeTruthy();
  });

  it('should initialize in edit mode when ID provided', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');
    userServiceSpy.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.isEditMode).toBeTruthy();
    expect(component.userId).toBe('1');
    expect(userServiceSpy.getUserById).toHaveBeenCalledWith('1');
  });

  it('should populate form when loading user in edit mode', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');
    userServiceSpy.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.userForm.get('name')?.value).toBe(mockUser.name);
    expect(component.userForm.get('email')?.value).toBe(mockUser.email);
  });

  it('should handle error when loading user', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');
    const errorMessage = 'User not found';
    userServiceSpy.getUserById.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalsy();
  });

  it('should validate required fields', () => {
    component.userForm.patchValue({
      name: '',
      email: '',
      password: ''
    });

    const isValid = component['validateForm']();

    expect(isValid).toBeFalsy();
    expect(component.validationErrors.length).toBeGreaterThan(0);
  });

  it('should validate password confirmation', () => {
    const testPassword = generateTestPassword();
    component.userForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: testPassword,
      confirmPassword: 'different'
    });

    const isValid = component['validateForm']();

    expect(isValid).toBeFalsy();
    expect(component.validationErrors.some(error => error.includes('match'))).toBeTruthy();
  });

  it('should require at least one permission', () => {
    const testPassword = generateTestPassword();
    component.userForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: testPassword,
      confirmPassword: testPassword
    });

    // Ensure no permissions are selected
    component.permissionsArray.controls.forEach(control => control.setValue(false));

    const isValid = component['validateForm']();

    expect(isValid).toBeFalsy();
    expect(component.validationErrors.some(error => error.includes('permission'))).toBeTruthy();
  });

  it('should create user successfully', () => {
    const createResponse = { insertedId: 'new-id' };
    userServiceSpy.createUser.and.returnValue(of(createResponse));

    const testPassword = generateTestPassword();
    component.userForm.patchValue({
      name: 'New User',
      email: 'new@example.com',
      password: testPassword,
      confirmPassword: testPassword
    });

    // Select at least one permission
    component.permissionsArray.at(0).setValue(true);

    component.onSubmit();

    expect(userServiceSpy.createUser).toHaveBeenCalled();
    expect(component.success).toBe('User created successfully');
  });

  it('should update user successfully', () => {
    component.isEditMode = true;
    component.userId = '1';
    const updateResponse = { modifiedCount: 1 };
    userServiceSpy.updateUser.and.returnValue(of(updateResponse));

    component.userForm.patchValue({
      name: 'Updated User',
      email: 'updated@example.com'
    });

    // Select at least one permission
    component.permissionsArray.at(0).setValue(true);

    component.onSubmit();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith('1', jasmine.any(Object));
    expect(component.success).toBe('User updated successfully');
  });

  it('should handle create user error', () => {
    const errorMessage = 'Email already exists';
    userServiceSpy.createUser.and.returnValue(throwError(() => new Error(errorMessage)));

    const testPassword = generateTestPassword();
    component.userForm.patchValue({
      name: 'New User',
      email: 'existing@example.com',
      password: testPassword,
      confirmPassword: testPassword
    });

    component.permissionsArray.at(0).setValue(true);

    component.onSubmit();

    expect(component.error).toBe(errorMessage);
    expect(component.saving).toBeFalsy();
  });

  it('should navigate back on cancel', () => {
    component.onCancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/users']);
  });

  it('should reset form correctly', () => {
    component.userForm.patchValue({
      name: 'Test',
      email: 'test@example.com'
    });
    component.error = 'Test error';
    component.success = 'Test success';

    component.onReset();

    expect(component.error).toBeNull();
    expect(component.success).toBeNull();
  });

  it('should toggle permission correctly', () => {
    const initialValue = component.permissionsArray.at(0).value;

    component.togglePermission(0);

    expect(component.permissionsArray.at(0).value).toBe(!initialValue);
    expect(component.selectedRole).toBe('');
  });

  it('should update permissions when role changes', () => {
    const rolePermissions = [Permission.USER_READ, Permission.USER_CREATE];
    userServiceSpy.getPermissionsForRole.and.returnValue(rolePermissions);
    component.selectedRole = 'editor';

    component.onRoleChange();

    expect(userServiceSpy.getPermissionsForRole).toHaveBeenCalledWith('editor');
  });

  it('should get permission display name correctly', () => {
    const displayName = component.getPermissionDisplayName(Permission.USER_READ);

    expect(displayName).toBe('User Read');
  });

  it('should get permission category correctly', () => {
    const category = component.getPermissionCategory(Permission.USER_READ);

    expect(category).toBe('User');
  });

  it('should track permissions by value', () => {
    const permission = Permission.USER_READ;
    const result = component.trackByPermission(0, permission);

    expect(result).toBe(permission);
  });
});
