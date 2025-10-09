/**
 * User interface based on 3d-inventory-mongo-api users.ts
 * Represents a user in the system with authentication and permission data
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for security - don't send back from API
  token?: string; // JWT token
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User creation interface - used when creating new users
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  permissions: string[];
}

/**
 * User update interface - used when updating existing users
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  permissions?: string[];
}

/**
 * Login request interface
 */
export interface LoginRequest {
  username: string;
  password: string; // Required - API requires both username and password
}

/**
 * Login response interface
 */
export interface LoginResponse {
  token: string;
  user?: User;
}

/**
 * JWT Token payload interface
 */
export interface JwtPayload {
  id: number;
  username: string;
  iat?: number; // issued at
  exp?: number; // expires at
}

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

/**
 * Permission enum - based on API collections and operations
 */
export enum Permission {
  // User management
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Device management
  DEVICE_READ = 'device:read',
  DEVICE_CREATE = 'device:create',
  DEVICE_UPDATE = 'device:update',
  DEVICE_DELETE = 'device:delete',

  // Model management
  MODEL_READ = 'model:read',
  MODEL_CREATE = 'model:create',
  MODEL_UPDATE = 'model:update',
  MODEL_DELETE = 'model:delete',

  // Connection management
  CONNECTION_READ = 'connection:read',
  CONNECTION_CREATE = 'connection:create',
  CONNECTION_UPDATE = 'connection:update',
  CONNECTION_DELETE = 'connection:delete',

  // Attribute management
  ATTRIBUTE_READ = 'attribute:read',
  ATTRIBUTE_CREATE = 'attribute:create',
  ATTRIBUTE_UPDATE = 'attribute:update',
  ATTRIBUTE_DELETE = 'attribute:delete',

  // Floor management
  FLOOR_READ = 'floor:read',
  FLOOR_CREATE = 'floor:create',
  FLOOR_UPDATE = 'floor:update',
  FLOOR_DELETE = 'floor:delete',

  // Log management
  LOG_READ = 'log:read',
  LOG_CREATE = 'log:create',

  // Admin permissions
  ADMIN_FULL = 'admin:full',
  SYSTEM_ADMIN = 'system:admin'
}

/**
 * Role interface for predefined permission groups
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

/**
 * Predefined roles
 */
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to all data',
    permissions: [
      Permission.USER_READ,
      Permission.DEVICE_READ,
      Permission.MODEL_READ,
      Permission.CONNECTION_READ,
      Permission.ATTRIBUTE_READ,
      Permission.FLOOR_READ,
      Permission.LOG_READ
    ]
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can view and edit most data except users',
    permissions: [
      Permission.USER_READ,
      Permission.DEVICE_READ,
      Permission.DEVICE_CREATE,
      Permission.DEVICE_UPDATE,
      Permission.MODEL_READ,
      Permission.MODEL_CREATE,
      Permission.MODEL_UPDATE,
      Permission.CONNECTION_READ,
      Permission.CONNECTION_CREATE,
      Permission.CONNECTION_UPDATE,
      Permission.ATTRIBUTE_READ,
      Permission.ATTRIBUTE_CREATE,
      Permission.ATTRIBUTE_UPDATE,
      Permission.FLOOR_READ,
      Permission.FLOOR_CREATE,
      Permission.FLOOR_UPDATE,
      Permission.LOG_READ,
      Permission.LOG_CREATE
    ]
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access including user management',
    permissions: [
      Permission.USER_READ,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
      Permission.DEVICE_READ,
      Permission.DEVICE_CREATE,
      Permission.DEVICE_UPDATE,
      Permission.DEVICE_DELETE,
      Permission.MODEL_READ,
      Permission.MODEL_CREATE,
      Permission.MODEL_UPDATE,
      Permission.MODEL_DELETE,
      Permission.CONNECTION_READ,
      Permission.CONNECTION_CREATE,
      Permission.CONNECTION_UPDATE,
      Permission.CONNECTION_DELETE,
      Permission.ATTRIBUTE_READ,
      Permission.ATTRIBUTE_CREATE,
      Permission.ATTRIBUTE_UPDATE,
      Permission.ATTRIBUTE_DELETE,
      Permission.FLOOR_READ,
      Permission.FLOOR_CREATE,
      Permission.FLOOR_UPDATE,
      Permission.FLOOR_DELETE,
      Permission.LOG_READ,
      Permission.LOG_CREATE,
      Permission.ADMIN_FULL
    ]
  },
  {
    id: 'system-admin',
    name: 'System Administrator',
    description: 'Complete system access including system administration',
    permissions: [Permission.SYSTEM_ADMIN]
  }
];

/**
 * API Error response interface
 */
export interface ApiError {
  message: string;
  module?: string;
  procedure?: string;
  status?: string;
  error?: string;
}
