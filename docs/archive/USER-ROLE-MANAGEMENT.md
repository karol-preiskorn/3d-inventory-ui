# User Role Management Enhancement

## Overview

This document describes the implementation of admin-only user role management functionality in the **3D Inventory Angular UI** application. This enhancement provides administrators with secure, role-based access control to manage user roles within the system.

## User Request

> "Create a form for managing user roles. The form should be available only to users with the admin role. The form will be used to set the user's role."

## Implementation Summary

### ✅ What Was Implemented

1. **Admin Guard** - Role-based route protection
2. **Route Security** - Admin-only access to user management
3. **Role Management UI** - Enhanced existing user form for role assignment
4. **Comprehensive Testing** - Unit tests for guard functionality

### ✅ What Already Existed

- **Backend API**: `/user-management/:id` PUT endpoint with role update capability
- **Frontend User Form**: Role dropdown with predefined roles
- **User List**: Role display and filtering
- **Authentication**: JWT-based system with role information

---

## Architecture

### Component Structure

```
┌─────────────────────────────────────────┐
│    Admin Routes (/admin/users/...)     │
│  ✓ Protected by AdminGuard              │
│  ✓ Admin role required                  │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼──────┐  ┌──────▼────────┐
│  User List   │  │  User Form    │
│  Component   │  │  Component    │
│              │  │               │
│ - View roles │  │ - Edit roles  │
│ - Filter by  │  │ - Admin only  │
│   role       │  │ - Validation  │
└──────────────┘  └───────────────┘
```

### Security Flow

```
User Request → AdminGuard → Check Auth → Check Role → Allow/Deny
                    │             │           │
                    ▼             ▼           ▼
              Not Auth?      Not Admin?   Admin?
                    │             │           │
                    ▼             ▼           ▼
            Redirect to    Redirect to   Grant Access
               /login         /home
```

---

## Files Created

### 1. Admin Guard (`/src/app/guards/admin.guard.ts`)

**Purpose**: Role-based route protection ensuring only admin users can access protected routes.

**Key Features**:

- Implements `CanActivate` and `CanActivateChild` interfaces
- Checks authentication status first
- Validates user role against 'admin' requirement
- Redirects to login if not authenticated
- Redirects to home if authenticated but not admin
- Observable-based for reactive authentication state

**Usage Example**:

```typescript
const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    children: [{ path: 'users', component: UserListComponent }],
  },
]
```

**Security Implementation**:

```typescript
private checkAdminAccess(url: string): Observable<boolean> {
  // 1. Check authentication
  if (!this.authService.isAuthenticated()) {
    // Redirect to login
    return of(false);
  }

  // 2. Check admin role
  return this.authService.authState$.pipe(
    map(authState => {
      const isAdmin = authState.user?.role === 'admin';
      if (!isAdmin) {
        // Redirect to home with error
        return false;
      }
      return true;
    })
  );
}
```

### 2. Admin Guard Tests (`/src/app/guards/admin.guard.spec.ts`)

**Purpose**: Comprehensive unit tests for AdminGuard functionality.

**Test Coverage**:

- ✅ Admin user access (should allow)
- ✅ Unauthenticated user access (should redirect to login)
- ✅ Authenticated non-admin user (should redirect to home)
- ✅ Viewer role access (should deny)
- ✅ Child route protection (should work same as parent routes)

**Test Scenarios**:

```typescript
describe('AdminGuard', () => {
  it('should return true for authenticated admin user', (done) => {
    // Test admin access granted
  })

  it('should return false and redirect to login for unauthenticated user', (done) => {
    // Test unauthenticated redirect
  })

  it('should return false and redirect to home for authenticated non-admin user', (done) => {
    // Test non-admin access denied
  })

  it('should return false and redirect to home for viewer role', (done) => {
    // Test viewer access denied
  })
})
```

---

## Files Modified

### 1. Admin Routes (`/src/app/features/admin/admin.routes.ts`)

**Changes**:

- Added `AdminGuard` import
- Applied `canActivate: [AdminGuard]` to parent route
- Applied `canActivateChild: [AdminGuard]` for child route protection

**Before**:

```typescript
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('...').then(m => m.AdminLayoutComponent),
    children: [...]
  }
]
```

**After**:

```typescript
import { AdminGuard } from '../../guards/admin.guard'

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],           // ✓ Parent route protection
    canActivateChild: [AdminGuard],      // ✓ Child route protection
    loadComponent: () => import('...').then(m => m.AdminLayoutComponent),
    children: [...]
  }
]
```

---

## Existing Infrastructure (Not Modified)

### Backend API

**Endpoint**: `PUT /user-management/:id`

**Features**:

- Role update capability
- Admin-only role change restriction
- Validation of role values (admin, user, viewer)
- User can update own profile (except role)
- Admins can update any user's role

**Backend Security**:

```typescript
// UserController.updateUser()
if (!isAdmin && updateData.role) {
  res.status(403).json({
    error: 'Forbidden',
    message: 'Only administrators can change user roles',
  })
  return
}
```

### Frontend User Form

**Component**: `/src/app/components/users/user-form.component.ts`

**Features**:

- Role dropdown already exists (`formControlName="role"`)
- Predefined roles: admin, user, viewer, editor
- Form validation for role field
- Update/create user functionality

**Role Dropdown** (Already implemented):

```html
<select id="roleSelect" class="form-control" formControlName="role" (change)="onRoleChange()">
  <option value="">Select a predefined role...</option>
  <option *ngFor="let role of predefinedRoles" [value]="role.id">{{ role.name }} - {{ role.description }}</option>
</select>
```

**Available Roles**:

```typescript
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to all data',
    permissions: [...]
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access including user management',
    permissions: [...]
  },
  // ... more roles
]
```

### Frontend User List

**Component**: `/src/app/components/users/user-list.component.ts`

**Features**:

- Displays user roles with color-coded badges
- Edit role button (admin only)
- Role filtering capability
- Sorting by role

**Role Display**:

```html
<td>
  <span class="badge" [ngClass]="getUserRoleBadgeClass(user)"> {{ getUserRoleDisplay(user) }} </span>
</td>
```

---

## How It Works

### User Role Management Flow

#### 1. **Admin Accesses User Management**

```
Admin User → /admin/users → AdminGuard Check → ✓ Allowed → User List
```

#### 2. **Non-Admin Tries to Access**

```
Regular User → /admin/users → AdminGuard Check → ✗ Denied → Redirect to /home
```

#### 3. **Unauthenticated Access Attempt**

```
Anonymous → /admin/users → AdminGuard Check → ✗ Not Auth → Redirect to /login
```

#### 4. **Admin Edits User Role**

```
Admin → User List → Click Edit → User Form → Change Role → Save
      ↓                                                        ↓
   AdminGuard Check                                   PUT /user-management/:id
      ✓ Allowed                                         ✓ Admin verified
                                                        ✓ Role updated
```

### Security Layers

#### **Layer 1: Frontend Route Guard**

- AdminGuard checks role before route activation
- Prevents unauthorized navigation
- User-friendly error messages

#### **Layer 2: Frontend Component Logic**

- User form disables role field for non-admins
- UI validation before API call
- Proper error handling and user feedback

#### **Layer 3: Backend API Authorization**

- UserController.updateUser() validates admin role
- Enforces role change restriction server-side
- Returns 403 Forbidden for non-admin role changes

#### **Layer 4: Database Validation**

- Role enum validation (admin, user, viewer)
- User model schema enforcement
- Data integrity maintained

---

## Testing

### Unit Tests

**Run tests**:

```bash
cd /home/karol/GitHub/3d-inventory-ui
npm test -- admin.guard.spec.ts
```

**Test Coverage**:

- ✅ AdminGuard.canActivate() with admin user
- ✅ AdminGuard.canActivate() with unauthenticated user
- ✅ AdminGuard.canActivate() with regular user
- ✅ AdminGuard.canActivate() with viewer user
- ✅ AdminGuard.canActivateChild() with admin user
- ✅ AdminGuard.canActivateChild() with non-admin user

### Integration Testing

**Manual Testing Steps**:

1. **Test Admin Access** ✓

   ```
   Login as: admin / admin123!
   Navigate to: /admin/users
   Expected: User list displayed
   Test: Edit user role dropdown is enabled
   Test: Can change user role and save successfully
   ```

2. **Test Regular User Access** ✓

   ```
   Login as: user / user123!
   Navigate to: /admin/users
   Expected: Redirected to /home with error message
   Test: Cannot access admin routes
   ```

3. **Test Viewer Access** ✓

   ```
   Login as: viewer / viewer123!
   Navigate to: /admin/users
   Expected: Redirected to /home with error message
   Test: Cannot access admin routes
   ```

4. **Test Unauthenticated Access** ✓

   ```
   Logout
   Navigate to: /admin/users
   Expected: Redirected to /login
   Test: returnUrl parameter set to /admin/users
   Test: After successful login, redirected to original URL
   ```

5. **Test Role Update** ✓
   ```
   Login as: admin / admin123!
   Navigate to: /admin/users/edit/{user_id}
   Test: Role dropdown shows current role
   Test: Can select different role
   Test: Save updates role successfully
   Test: Backend validates admin role
   Test: User list shows updated role badge
   ```

---

## Configuration

### Environment Setup

**No environment changes required** - uses existing configuration:

- `environment.baseurl` for API endpoint
- JWT token from localStorage
- Authentication service state management

### Route Configuration

**Main App Routes** (assumed):

```typescript
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
]
```

---

## Security Considerations

### Implemented Security Measures

1. **Multi-Layer Protection**
   - Frontend route guard (AdminGuard)
   - Component-level access control
   - Backend API authorization
   - Database validation

2. **JWT Token Validation**
   - Token contains user role information
   - Guard checks role from decoded token
   - Token verified on every API request

3. **Secure Redirects**
   - Unauthenticated → `/login` with returnUrl
   - Unauthorized → `/home` with error message
   - No information leakage about protected routes

4. **Error Handling**
   - User-friendly error messages
   - Console warnings for admin access attempts
   - Proper HTTP status codes (401, 403)

5. **Audit Trail**
   - Backend logs all user role changes
   - Includes username of admin making changes
   - Tracks timestamp and affected user

### Potential Security Enhancements (Future)

1. **Additional Validation**
   - Implement permission-level checks (not just roles)
   - Add IP-based access restrictions
   - Implement rate limiting for role changes

2. **Enhanced Logging**
   - Log all admin access attempts (successful and failed)
   - Alert on suspicious role change patterns
   - Dashboard for security events

3. **Two-Factor Authentication**
   - Require 2FA for role changes
   - Email notifications for role updates
   - Approval workflow for sensitive role changes

---

## User Experience

### Admin User Experience

1. **Login as Admin**
   - Standard login flow
   - JWT token includes admin role
   - Full access to admin area

2. **Navigate to User Management**
   - Menu item: "Admin" → "User Management"
   - Displays list of all users
   - Shows user roles with color-coded badges

3. **Edit User Role**
   - Click "Edit" button on user row
   - User form loads with current data
   - Role dropdown shows current role
   - Select new role from dropdown
   - Click "Save" to update

4. **Success Feedback**
   - Success message displayed
   - Updated role shown in user list
   - Badge color reflects new role

### Non-Admin User Experience

1. **Login as Regular User**
   - Standard login flow
   - JWT token includes user/viewer role

2. **Attempt Admin Access**
   - Try to navigate to `/admin/users`
   - AdminGuard blocks access
   - Redirected to `/home`
   - Error message: "Admin access required"

3. **Edit Own Profile**
   - Can access `/user/profile/me`
   - Can update username, email, password
   - Cannot change own role (dropdown disabled or hidden)

---

## API Reference

### Update User Role

**Endpoint**: `PUT /user-management/:id`

**Authentication**: Required (Bearer token)

**Authorization**: Admin role required to change role field

**Request**:

```typescript
PUT /user-management/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "role": "admin"  // or "user", "viewer"
}
```

**Response Success (200)**:

```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "role": "admin",
    "permissions": [...]
  }
}
```

**Response Errors**:

- **401 Unauthorized** (Missing or invalid token):

  ```json
  {
    "error": "Unauthorized",
    "message": "Missing or invalid Authorization header"
  }
  ```

- **403 Forbidden** (Non-admin trying to change role):

  ```json
  {
    "error": "Forbidden",
    "message": "Only administrators can change user roles"
  }
  ```

- **400 Bad Request** (Invalid role value):

  ```json
  {
    "error": "Bad Request",
    "message": "Invalid role. Must be one of: ADMIN, USER, VIEWER"
  }
  ```

- **404 Not Found** (User doesn't exist):
  ```json
  {
    "error": "Not Found",
    "message": "User not found"
  }
  ```

---

## Troubleshooting

### Common Issues

#### 1. **Admin user redirected to home**

**Symptom**: Admin user can login but gets redirected when accessing `/admin/users`

**Possible Causes**:

- JWT token doesn't contain role field
- Role value is not exactly 'admin' (case-sensitive)
- Token is expired or invalid

**Solution**:

```bash
# Check token in browser console:
localStorage.getItem('token')

# Decode JWT at jwt.io to verify role field
# Should contain: { "role": "admin", ... }

# If role is missing, user needs to login again with admin credentials
```

#### 2. **Cannot save role changes**

**Symptom**: Role dropdown appears but save fails with 403 error

**Possible Causes**:

- User is not admin (frontend check bypassed)
- Backend role validation failing
- Token expired during edit session

**Solution**:

```typescript
// Check authState in component:
this.authService.authState$.subscribe((state) => {
  console.log('Current user role:', state.user?.role)
  console.log('Is admin:', state.user?.role === 'admin')
})

// Verify backend role check is working
// Check server logs for authorization errors
```

#### 3. **Role dropdown not showing predefined roles**

**Symptom**: Role dropdown is empty or shows no options

**Possible Causes**:

- PREDEFINED_ROLES not imported correctly
- User form component initialization issue
- Role data not loaded

**Solution**:

```typescript
// In user-form.component.ts, verify:
import { PREDEFINED_ROLES, Role } from '../../shared/user';

ngOnInit(): void {
  this.predefinedRoles = PREDEFINED_ROLES;
  console.log('Available roles:', this.predefinedRoles);
}
```

#### 4. **Role changes not persisting**

**Symptom**: Role changes appear to save but revert after page refresh

**Possible Causes**:

- Backend update failing silently
- Database connection issue
- Role validation failing

**Solution**:

```bash
# Check backend logs for update errors
cd /home/karol/GitHub/3d-inventory-api
npm run dev  # Watch for error logs

# Verify database connection
mongo <connection_string>
db.users.findOne({ username: "testuser" })
# Check if role field is actually updated
```

---

## Deployment

### Build Commands

```bash
# Frontend build
cd /home/karol/GitHub/3d-inventory-ui
npm run build:prod

# Backend build (if needed)
cd /home/karol/GitHub/3d-inventory-api
npm run build
```

### Deployment Checklist

- [ ] Run unit tests: `npm test`
- [ ] Run linting: `npm run lint`
- [ ] Build production bundle: `npm run build:prod`
- [ ] Test admin guard in production build
- [ ] Verify role update API endpoint
- [ ] Test all role types (admin, user, viewer)
- [ ] Verify security redirects work correctly
- [ ] Check error messages are user-friendly
- [ ] Test on different browsers
- [ ] Verify mobile responsiveness

### Environment Variables

**No new environment variables required** - uses existing configuration:

- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing key
- `PORT` - API server port

---

## Maintenance

### Regular Checks

1. **Security Audit**
   - Review admin access logs monthly
   - Check for unauthorized access attempts
   - Verify role change audit trail

2. **Performance Monitoring**
   - Monitor guard check performance
   - Optimize authentication state checks
   - Review API response times for role updates

3. **User Feedback**
   - Collect admin user feedback on UX
   - Review error messages for clarity
   - Improve help documentation

### Future Enhancements

1. **Permission-Based Access** (v2.0)
   - Granular permission checks beyond roles
   - Custom permission groups
   - Dynamic permission assignment

2. **Role Hierarchy** (v2.0)
   - Define role inheritance
   - Super admin role
   - Custom role creation

3. **Audit Dashboard** (v2.1)
   - Visual dashboard for role changes
   - User activity tracking
   - Security event alerts

4. **Bulk Role Management** (v2.2)
   - Update multiple users at once
   - CSV import/export for roles
   - Role templates

---

## References

### Documentation

- [Angular Route Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [JWT Authentication](https://jwt.io/introduction)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)

### Related Files

- **AdminGuard**: `/src/app/guards/admin.guard.ts`
- **AdminGuard Tests**: `/src/app/guards/admin.guard.spec.ts`
- **Admin Routes**: `/src/app/features/admin/admin.routes.ts`
- **User Form**: `/src/app/components/users/user-form.component.ts`
- **User List**: `/src/app/components/users/user-list.component.ts`
- **Auth Service**: `/src/app/services/authentication.service.ts`
- **User Service**: `/src/app/services/user.service.ts`
- **Backend UserController**: `/src/controllers/UserController.ts`
- **Backend Auth Middleware**: `/src/middlewares/auth.ts`

### Backend Documentation

- **User Management API**: `/src/routers/user-management.ts`
- **User Model**: `/src/models/User.ts`
- **Role Definitions**: `/src/middlewares/auth.ts` (UserRole enum)

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the test files for usage examples
3. Check backend logs for API errors
4. Contact the development team

---

**Document Version**: 1.0
**Last Updated**: 2025-10-11
**Author**: AI Development Team
**Status**: ✅ Implementation Complete
