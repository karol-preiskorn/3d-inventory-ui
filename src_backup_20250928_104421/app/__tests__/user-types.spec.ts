/**
 * Tests for user interfaces and types
 */

import { AuthState, CreateUserRequest, Permission, UpdateUserRequest, User } from '../shared/user';

describe('User Types and Interfaces', () => {
  describe('Permission enum', () => {
    it('should have all required user permissions', () => {
      expect(Permission.USER_READ).toBe('user:read');
      expect(Permission.USER_CREATE).toBe('user:create');
      expect(Permission.USER_UPDATE).toBe('user:update');
      expect(Permission.USER_DELETE).toBe('user:delete');
    });

    it('should have all required device permissions', () => {
      expect(Permission.DEVICE_READ).toBe('device:read');
      expect(Permission.DEVICE_CREATE).toBe('device:create');
      expect(Permission.DEVICE_UPDATE).toBe('device:update');
      expect(Permission.DEVICE_DELETE).toBe('device:delete');
    });

    it('should have all required model permissions', () => {
      expect(Permission.MODEL_READ).toBe('model:read');
      expect(Permission.MODEL_CREATE).toBe('model:create');
      expect(Permission.MODEL_UPDATE).toBe('model:update');
      expect(Permission.MODEL_DELETE).toBe('model:delete');
    });

    it('should have all required connection permissions', () => {
      expect(Permission.CONNECTION_READ).toBe('connection:read');
      expect(Permission.CONNECTION_CREATE).toBe('connection:create');
      expect(Permission.CONNECTION_UPDATE).toBe('connection:update');
      expect(Permission.CONNECTION_DELETE).toBe('connection:delete');
    });

    it('should have consistent permission format', () => {
      const permissionValues = Object.values(Permission);
      permissionValues.forEach(permission => {
        expect(permission).toMatch(/^[a-z]+:[a-z]+$/);
      });
    });
  });

  describe('User interface', () => {
    it('should allow creating user objects with required fields', () => {
      const user: User = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        permissions: [Permission.USER_READ, Permission.DEVICE_READ]
      };

      expect(user._id).toBe('123');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.permissions).toEqual([Permission.USER_READ, Permission.DEVICE_READ]);
    });

    it('should allow optional fields', () => {
      const user: User = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        permissions: [],
        password: 'secret',
        token: 'jwt-token',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(user.password).toBe('secret');
      expect(user.token).toBe('jwt-token');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('CreateUserRequest interface', () => {
    it('should allow creating user request objects', () => {
      const request: CreateUserRequest = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        permissions: [Permission.USER_READ]
      };

      expect(request.name).toBe('New User');
      expect(request.email).toBe('new@example.com');
      expect(request.password).toBe('password123');
      expect(request.permissions).toEqual([Permission.USER_READ]);
    });
  });

  describe('UpdateUserRequest interface', () => {
    it('should allow partial updates', () => {
      const updateRequest: UpdateUserRequest = {
        name: 'Updated Name'
      };

      expect(updateRequest.name).toBe('Updated Name');
      // Other fields should be optional
    });

    it('should allow updating multiple fields', () => {
      const updateRequest: UpdateUserRequest = {
        name: 'Updated Name',
        email: 'updated@example.com',
        permissions: [Permission.DEVICE_READ, Permission.MODEL_READ]
      };

      expect(updateRequest.name).toBe('Updated Name');
      expect(updateRequest.email).toBe('updated@example.com');
      expect(updateRequest.permissions).toEqual([Permission.DEVICE_READ, Permission.MODEL_READ]);
    });
  });

  describe('AuthState interface', () => {
    it('should represent authenticated state', () => {
      const authState: AuthState = {
        isAuthenticated: true,
        user: {
          _id: '123',
          name: 'Authenticated User',
          email: 'auth@example.com',
          permissions: [Permission.USER_READ]
        },
        token: 'jwt-token-123'
      };

      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user).toBeDefined();
      expect(authState.token).toBe('jwt-token-123');
    });

    it('should represent unauthenticated state', () => {
      const authState: AuthState = {
        isAuthenticated: false,
        user: null,
        token: null
      };

      expect(authState.isAuthenticated).toBe(false);
      expect(authState.user).toBeNull();
      expect(authState.token).toBeNull();
    });
  });
});
