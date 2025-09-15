import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { User, CreateUserRequest, UpdateUserRequest, Permission } from '../shared/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const mockUsers: User[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      permissions: [Permission.USER_READ, Permission.DEVICE_READ]
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      permissions: [Permission.ADMIN_FULL]
    }
  ];

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getAuthHeaders']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;

    // Set up default auth headers mock
    authServiceSpy.getAuthHeaders.and.returnValue(
      new Headers({ 'Authorization': 'Bearer test-token', 'Content-Type': 'application/json' }) as any
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch all users', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
      });

      const req = httpMock.expectOne('http://localhost:8080/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when fetching users', () => {
      service.getUsers().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.message).toContain('Server error');
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/users');
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserById', () => {
    it('should fetch user by ID', () => {
      const userId = '1';
      const expectedUser = mockUsers[0];

      service.getUserById(userId).subscribe(user => {
        expect(user).toEqual(expectedUser);
      });

      const req = httpMock.expectOne(`http://localhost:8080/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: CreateUserRequest = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        permissions: [Permission.USER_READ]
      };

      const mockResponse = { insertedId: 'new-id' };

      service.createUser(newUser).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(mockResponse);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const userId = '1';
      const updateData: UpdateUserRequest = {
        name: 'Updated Name',
        permissions: [Permission.USER_READ, Permission.USER_UPDATE]
      };

      const mockResponse = { modifiedCount: 1 };

      service.updateUser(userId, updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/users/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const userId = '1';
      const mockResponse = { deletedCount: 1 };

      service.deleteUser(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:8080/users/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('permission management', () => {
    it('should check if user has specific permission', () => {
      const user = mockUsers[0];

      expect(service.userHasPermission(user, Permission.USER_READ)).toBeTruthy();
      expect(service.userHasPermission(user, Permission.ADMIN_FULL)).toBeFalsy();
    });

    it('should check if user has any of the specified permissions', () => {
      const user = mockUsers[0];

      expect(service.userHasAnyPermission(user, [Permission.USER_READ, Permission.ADMIN_FULL])).toBeTruthy();
      expect(service.userHasAnyPermission(user, [Permission.ADMIN_FULL, Permission.SYSTEM_ADMIN])).toBeFalsy();
    });

    it('should check if user is admin', () => {
      const regularUser = mockUsers[0];
      const adminUser = mockUsers[1];

      expect(service.userIsAdmin(regularUser)).toBeFalsy();
      expect(service.userIsAdmin(adminUser)).toBeTruthy();
    });
  });

  describe('role management', () => {
    it('should get available permissions', () => {
      const permissions = service.getAvailablePermissions();
      expect(permissions).toContain(Permission.USER_READ);
      expect(permissions).toContain(Permission.ADMIN_FULL);
      expect(permissions.length).toBeGreaterThan(0);
    });

    it('should get predefined roles', () => {
      const roles = service.getPredefinedRoles();
      expect(roles.length).toBeGreaterThan(0);
      expect(roles.some(role => role.id === 'admin')).toBeTruthy();
    });

    it('should get permissions for a specific role', () => {
      const adminPermissions = service.getPermissionsForRole('admin');
      expect(adminPermissions).toContain(Permission.USER_READ);
      expect(adminPermissions).toContain(Permission.ADMIN_FULL);
    });
  });

  describe('data validation', () => {
    it('should validate user data correctly', () => {
      const validUser: CreateUserRequest = {
        name: 'Valid User',
        email: 'valid@example.com',
        password: 'password123',
        permissions: [Permission.USER_READ]
      };

      const errors = service.validateUserData(validUser);
      expect(errors.length).toBe(0);
    });

    it('should return errors for invalid user data', () => {
      const invalidUser: CreateUserRequest = {
        name: 'A', // Too short
        email: 'invalid-email', // Invalid format
        password: '123', // Too short
        permissions: ['invalid-permission'] as any // Invalid permission
      };

      const errors = service.validateUserData(invalidUser);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.includes('Name must be'))).toBeTruthy();
      expect(errors.some(error => error.includes('valid email'))).toBeTruthy();
      expect(errors.some(error => error.includes('Password must be'))).toBeTruthy();
    });
  });

  describe('search and pagination', () => {
    it('should search users by name or email', () => {
      service.searchUsers('john').subscribe(users => {
        expect(users.length).toBe(1);
        expect(users[0].name).toBe('John Doe');
      });

      const req = httpMock.expectOne('http://localhost:8080/users');
      req.flush(mockUsers);
    });

    it('should get paginated users', () => {
      service.getUsersPaginated(1, 1).subscribe(result => {
        expect(result.users.length).toBe(1);
        expect(result.total).toBe(2);
        expect(result.users[0]).toEqual(mockUsers[0]);
      });

      const req = httpMock.expectOne('http://localhost:8080/users');
      req.flush(mockUsers);
    });
  });
});
