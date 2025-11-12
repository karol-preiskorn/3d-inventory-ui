# Admin User Management Guide

**Date**: October 12, 2025
**Feature**: Complete User Management System for Administrators
**Status**: ✅ **FULLY IMPLEMENTED**

---

## 🎯 Overview

This guide documents the complete user management system available to administrators. The system provides comprehensive tools for creating, editing, and managing users with role-based permissions.

---

## 📍 Access Requirements

### Who Can Access

- **Required Permission**: `user:create`, `user:update`, `user:delete`
- **Required Role**: Administrator or System Administrator
- **Route Protection**: AdminGuard ensures only admin users can access

### How to Access

```
Main Route: /admin/users
Add User:   /admin/users/new
Edit User:  /admin/users/edit/:id
```

**Navigation**:

1. Login as admin user
2. Navigate to Admin section
3. Click "User Management" or access `/admin/users`

---

## 🏗️ System Architecture

### Components

1. **UserListComponent** (`user-list.component.ts`)
   - Displays all users in a sortable, filterable table
   - Provides search and role filtering
   - Shows user permissions and status
   - Navigation to add/edit forms

2. **UserFormComponent** (`user-form.component.ts`)
   - Dual-purpose: Create new users OR edit existing users
   - Reactive forms with validation
   - Permission assignment interface
   - Role-based permission presets

3. **AdminGuard** (`admin.guard.ts`)
   - Protects admin routes from unauthorized access
   - Verifies user has admin role
   - Redirects non-admin users to home

### Route Configuration

```typescript
// app-routing.module.ts
{
  path: 'admin',
  component: AdminLayoutComponent,
  canActivate: [AdminGuard],
  canActivateChild: [AdminGuard],  // NEW: Protects all child routes
  children: [
    { path: 'users', component: UserListComponent, title: 'User Management' },
    { path: 'users/new', component: UserFormComponent, title: 'Add User' },
    { path: 'users/edit/:id', component: UserFormComponent, title: 'Edit User' },
    { path: 'profile', component: UserProfileComponent, title: 'My Profile' },
  ]
}
```

---

## 📋 User List Features

### Display & Navigation

```
┌─────────────────────────────────────────────────────────────┐
│ User Management                                             │
│ Manage system users and their permissions                   │
│                                      [➕ Add User] [🔄 Refresh] │
├─────────────────────────────────────────────────────────────┤
│ Search: [____________]  Role: [All Roles ▼]  [Clear Filters] │
│                                           24 users found      │
├─────────────────────────────────────────────────────────────┤
│ Name ↕ │ Email ↕ │ Role ↕ │ Permissions │ Status │ Actions │
├─────────────────────────────────────────────────────────────┤
│ admin   │ admin@  │ Admin  │ 24 perms 👁  │ Active │ 🛡 ✏ 🗑  │
│ (You)   │ inv.com │        │             │        │          │
├─────────────────────────────────────────────────────────────┤
│ user    │ user@   │ Editor │ 18 perms 👁  │ Active │ 🛡 ✏ 🗑  │
│         │ inv.com │        │             │        │          │
└─────────────────────────────────────────────────────────────┘

Icons:
  👁 = View Permissions     🛡 = Edit Role/Permissions
  ✏ = Edit User            🗑 = Delete User
```

### Key Features

1. **Search & Filter**
   - Search by username or email
   - Filter by role (Admin, Editor, Viewer, System Admin)
   - Debounced search (300ms) for performance
   - Clear filters button

2. **Sorting**
   - Sort by Name, Email, or Role
   - Ascending/Descending toggle
   - Visual sort indicators (↑↓)

3. **Pagination**
   - Configurable page size (default: 10 users)
   - Page navigation controls
   - Total user count display

4. **User Actions**
   - **View Permissions**: Opens modal showing all user permissions
   - **Edit Role**: Quick role/permission editing
   - **Edit User**: Full user profile editing
   - **Delete User**: Remove user (with confirmation)

5. **Permission-Based UI**
   - Add User button (requires `user:create`)
   - Edit buttons (requires `user:update`)
   - Delete button (requires `user:delete`)

---

## ➕ Add New User Form

### Form Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Add New User                      [⬅ Back to Users]         │
│ Create a new user account with appropriate permissions      │
├─────────────────────────────────────────────────────────────┤
│ ┌─ Basic Information ─────┐  ┌─ Permissions & Roles ─────┐ │
│ │                          │  │                           │ │
│ │ Username *               │  │ Quick Role Assignment     │ │
│ │ [________________]       │  │ [Select role... ▼]        │ │
│ │                          │  │                           │ │
│ │ Email Address *          │  │ Individual Permissions *  │ │
│ │ [________________]       │  │                           │ │
│ │                          │  │ ☐ User Management         │ │
│ │ Password *               │  │   ☐ user:read             │ │
│ │ [________________]       │  │   ☐ user:create           │ │
│ │                          │  │   ☐ user:update           │ │
│ │ Confirm Password *       │  │   ☐ user:delete           │ │
│ │ [________________]       │  │                           │ │
│ │                          │  │ ☐ Device Management       │ │
│ │                          │  │   ☐ device:read           │ │
│ │                          │  │   ☐ device:create         │ │
│ │                          │  │   ... (27 total)          │ │
│ └──────────────────────────┘  └───────────────────────────┘ │
│                                                             │
│ [💾 Create User] [↺ Reset] [✖ Cancel]                       │
│                                                             │
│ ℹ Fields marked with * are required                        │
└─────────────────────────────────────────────────────────────┘
```

### Form Fields

#### Basic Information

1. **Username** (Required)
   - Min length: 2 characters
   - Max length: 100 characters
   - Unique identifier for the user
   - Cannot be changed after creation (in some implementations)

2. **Email Address** (Required)
   - Must be valid email format
   - Max length: 255 characters
   - Used for notifications and login (if enabled)

3. **Password** (Required for new users)
   - Min length: 6 characters
   - Max length: 255 characters
   - Must match confirmation
   - Hashed before storage

4. **Confirm Password** (Required for new users)
   - Must match Password field
   - Validation error if mismatch

#### Permissions & Roles

1. **Quick Role Assignment** (Optional)
   - Dropdown with predefined roles:
     - **Viewer**: Read-only access (7 permissions)
     - **Editor**: Create and update access (18 permissions)
     - **Administrator**: Full access (24 permissions)
     - **System Administrator**: Complete system control (1 permission)
   - Automatically selects relevant permissions
   - Can be manually adjusted after selection

2. **Individual Permissions** (Required - at least one)
   - Grouped by category (9 categories)
   - Checkboxes for each permission
   - Categories:
     - User Management (4 permissions)
     - Device Management (4 permissions)
     - Model Management (4 permissions)
     - Connection Management (4 permissions)
     - Attribute Management (4 permissions)
     - Floor Management (4 permissions)
     - Log Management (3 permissions)
     - Administration (1 permission)
     - System (1 permission)

### Validation Rules

```typescript
// Username
- Required: true
- MinLength: 2
- MaxLength: 100

// Email
- Required: true
- Format: Valid email
- MaxLength: 255

// Password (new users)
- Required: true
- MinLength: 6
- MaxLength: 255

// Confirm Password
- Required: true
- Match: password field

// Permissions
- Required: At least one permission selected
```

### Form Behavior

1. **Role Selection**
   - Selecting a role auto-checks corresponding permissions
   - Manual permission changes clear role selection
   - Role provides convenient preset

2. **Password Match**
   - Real-time validation
   - Error displayed if passwords don't match
   - Form cannot be submitted with mismatch

3. **Validation Feedback**
   - Red border on invalid fields
   - Error messages below each field
   - Summary of all errors at top
   - Fields validated on blur and change

4. **Success Flow**

   ```
   1. Admin fills form
   2. Clicks "Create User"
   3. Validation runs
   4. If valid: API call to create user
   5. Success message displayed
   6. Auto-redirect to user list (1.5s delay)
   ```

5. **Error Handling**
   - Network errors displayed at top
   - Field-specific errors shown inline
   - Form remains editable on error
   - No redirect on error

---

## ✏️ Edit User Form

### Differences from Add User

1. **Pre-populated Fields**
   - Username, email, and permissions loaded from existing user
   - Current role selected (if applicable)

2. **Password Field**
   - NOT required for editing
   - Small text: "(leave empty to keep current)"
   - Only updated if new password provided

3. **Form Title**
   - "Edit User" instead of "Add New User"

4. **Submit Button**
   - "Update User" instead of "Create User"

5. **Loading State**
   - Shows spinner while loading user data
   - "Loading user data..." message

### Edit Form Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Edit User                         [⬅ Back to Users]         │
│ Update user information and permissions                     │
├─────────────────────────────────────────────────────────────┤
│ 🔄 Loading user data...                                     │
│                                                             │
│ ┌─ Basic Information ─────┐  ┌─ Permissions & Roles ─────┐ │
│ │ Username *               │  │ Quick Role Assignment     │ │
│ │ [john.doe___________]    │  │ [Editor ▼] (selected)     │ │
│ │                          │  │                           │ │
│ │ Email Address *          │  │ Individual Permissions *  │ │
│ │ [john@example.com___]    │  │ ☑ User Management         │ │
│ │                          │  │   ☑ user:read             │ │
│ │ Password                 │  │   ☐ user:create           │ │
│ │ [________________]       │  │   ☐ user:update           │ │
│ │ (leave empty to keep     │  │   ☐ user:delete           │ │
│ │  current)                │  │ ☑ Device Management       │ │
│ │                          │  │   ☑ device:read           │ │
│ │ Confirm Password         │  │   ☑ device:create         │ │
│ │ [________________]       │  │   ☑ device:update         │ │
│ └──────────────────────────┘  │   ☐ device:delete         │ │
│                               └───────────────────────────┘ │
│                                                             │
│ [💾 Update User] [↺ Reset] [✖ Cancel]                       │
└─────────────────────────────────────────────────────────────┘
```

### Edit Workflow

```
1. Admin clicks "Edit" button in user list
   └─> Navigate to /admin/users/edit/:id

2. Form loads user data
   ├─> Show loading spinner
   ├─> Fetch user by ID from API
   └─> Populate form fields

3. Admin modifies fields
   ├─> Change email
   ├─> Update permissions
   ├─> Optionally change password
   └─> Modify role

4. Admin clicks "Update User"
   ├─> Validation runs
   ├─> API call to update user
   └─> Success message + redirect

5. Return to user list
   └─> Updated user visible in list
```

---

## 🔐 Permission System

### Permission Categories

1. **User Management** (4 permissions)
   - `user:read` - View users
   - `user:create` - Create new users
   - `user:update` - Edit existing users
   - `user:delete` - Delete users

2. **Device Management** (4 permissions)
   - `device:read` - View devices
   - `device:create` - Create new devices
   - `device:update` - Edit existing devices
   - `device:delete` - Delete devices

3. **Model Management** (4 permissions)
   - `model:read` - View 3D models
   - `model:create` - Upload new models
   - `model:update` - Edit model properties
   - `model:delete` - Delete models

4. **Connection Management** (4 permissions)
   - `connection:read` - View connections
   - `connection:create` - Create connections
   - `connection:update` - Edit connections
   - `connection:delete` - Delete connections

5. **Attribute Management** (4 permissions)
   - `attribute:read` - View attributes
   - `attribute:create` - Create attributes
   - `attribute:update` - Edit attributes
   - `attribute:delete` - Delete attributes

6. **Floor Management** (4 permissions)
   - `floor:read` - View floor plans
   - `floor:create` - Create floor plans
   - `floor:update` - Edit floor plans
   - `floor:delete` - Delete floor plans

7. **Log Management** (3 permissions)
   - `log:read` - View system logs
   - `log:create` - Create log entries
   - `log:delete` - Delete logs

8. **Administration** (1 permission)
   - `admin:full` - Full administrative access

9. **System Administration** (1 permission)
   - `system:admin` - Complete system control

**Total**: 27 permissions

### Predefined Roles

#### Viewer Role

```typescript
{
  id: 'viewer',
  name: 'Viewer',
  description: 'Read-only access to all data',
  permissions: [
    'user:read',
    'device:read',
    'model:read',
    'connection:read',
    'attribute:read',
    'floor:read',
    'log:read'
  ]
}
// Total: 7 permissions (all read-only)
```

#### Editor Role

```typescript
{
  id: 'editor',
  name: 'Editor',
  description: 'Can create and edit data',
  permissions: [
    'user:read',
    'device:read', 'device:create', 'device:update',
    'model:read', 'model:create', 'model:update',
    'connection:read', 'connection:create', 'connection:update',
    'attribute:read', 'attribute:create', 'attribute:update',
    'floor:read', 'floor:create', 'floor:update',
    'log:read', 'log:create'
  ]
}
// Total: 18 permissions (read + create + update, no delete or user management)
```

#### Administrator Role

```typescript
{
  id: 'admin',
  name: 'Administrator',
  description: 'Full administrative access',
  permissions: [
    'user:read', 'user:create', 'user:update', 'user:delete',
    'device:read', 'device:create', 'device:update', 'device:delete',
    'model:read', 'model:create', 'model:update', 'model:delete',
    'connection:read', 'connection:create', 'connection:update', 'connection:delete',
    'attribute:read', 'attribute:create', 'attribute:update', 'attribute:delete',
    'floor:read', 'floor:create', 'floor:update', 'floor:delete',
    'log:read', 'log:create', 'log:delete',
    'admin:full'
  ]
}
// Total: 24 permissions (full CRUD + admin)
```

#### System Administrator Role

```typescript
{
  id: 'system-admin',
  name: 'System Administrator',
  description: 'Complete system control',
  permissions: ['system:admin']
}
// Total: 1 permission (grants all access)
```

---

## 🧪 Testing the User Management System

### Test Scenario 1: Create New User

```bash
# 1. Login as admin
Username: admin
Password: admin123!

# 2. Navigate to user management
URL: http://localhost:4200/admin/users

# 3. Click "Add User" button
Expected: Navigate to /admin/users/new

# 4. Fill out form
Username: testuser
Email: test@example.com
Password: testpass123
Confirm Password: testpass123
Role: Editor (auto-selects 18 permissions)

# 5. Click "Create User"
Expected:
  - Success message: "User created successfully"
  - Auto-redirect to /admin/users
  - New user visible in list

# 6. Verify in list
Expected:
  - Username: testuser
  - Email: test@example.com
  - Role: Editor
  - Permissions: 18 permissions
  - Status: Active
```

### Test Scenario 2: Edit Existing User

```bash
# 1. From user list, find user to edit
# 2. Click "Edit" button (pencil icon)
Expected: Navigate to /admin/users/edit/:id

# 3. Verify form pre-populated
Username: testuser (pre-filled)
Email: test@example.com (pre-filled)
Password: (empty - optional)
Permissions: 18 checked (Editor role)

# 4. Modify fields
Email: newtest@example.com
Role: Administrator (auto-checks 24 permissions)

# 5. Click "Update User"
Expected:
  - Success message: "User updated successfully"
  - Auto-redirect to /admin/users
  - User updated in list

# 6. Verify changes
Expected:
  - Email: newtest@example.com
  - Role: Administrator
  - Permissions: 24 permissions
```

### Test Scenario 3: Permission Validation

```bash
# 1. Create user with NO permissions selected
Expected:
  - Validation error: "At least one permission must be selected"
  - Form does not submit
  - Error displayed at top

# 2. Create user with weak password
Password: 123
Expected:
  - Validation error: "Password must be at least 6 characters"
  - Form does not submit

# 3. Create user with mismatched passwords
Password: testpass123
Confirm: different123
Expected:
  - Validation error: "Passwords do not match"
  - Form does not submit
```

### Test Scenario 4: Role-Based Access

```bash
# 1. Login as non-admin user
Username: viewer
Password: viewer123!

# 2. Try to access /admin/users
Expected:
  - AdminGuard blocks access
  - Redirect to home page
  - Error message: "Access denied. Admin role required."

# 3. Verify admin-only features hidden
Expected:
  - No "User Management" menu option
  - Cannot access /admin/users/new
  - Cannot access /admin/users/edit/:id
```

---

## 🎨 UI/UX Features

### Responsive Design

- **Desktop**: Two-column layout (Basic Info | Permissions)
- **Tablet**: Stacked columns with preserved spacing
- **Mobile**: Full-width single column

### Visual Indicators

1. **Current User**
   - Green "You" badge in user list
   - Different row highlight color

2. **Permission Count**
   - Badge showing total permissions
   - Eye icon to view details

3. **Role Badges**
   - Color-coded by role:
     - Admin: Red (`badge-danger`)
     - Editor: Blue (`badge-primary`)
     - Viewer: Yellow (`badge-warning`)
     - System Admin: Dark (`badge-dark`)

4. **Form Validation**
   - Red border on invalid fields
   - Green checkmark on valid fields
   - Inline error messages
   - Summary error list

5. **Loading States**
   - Spinner with "Loading..." text
   - Disabled buttons during save
   - "Saving..." button text

### Accessibility

- **Labels**: All form fields have proper `<label>` elements
- **ARIA**: Appropriate ARIA attributes
- **Keyboard Navigation**: Full tab order support
- **Screen Reader**: Descriptive text for icons
- **Required Fields**: Marked with asterisk (\*)

---

## 📊 API Integration

### Endpoints Used

1. **Get All Users**

   ```typescript
   GET /users
   Response: User[]
   ```

2. **Get User by ID**

   ```typescript
   GET /users/:id
   Response: User
   ```

3. **Create User**

   ```typescript
   POST /users
   Body: CreateUserRequest {
     username: string
     email: string
     password: string
     permissions: string[]
     role?: string
   }
   Response: User
   ```

4. **Update User**

   ```typescript
   PUT /users/:id
   Body: UpdateUserRequest {
     username?: string
     email?: string
     password?: string  // Optional
     permissions?: string[]
     role?: string
   }
   Response: User
   ```

5. **Delete User**
   ```typescript
   DELETE /users/:id
   Response: { success: boolean }
   ```

### Service Layer

```typescript
// UserService methods used by forms

getAvailablePermissions(): Permission[]
  // Returns array of all 27 permissions

getPredefinedRoles(): Role[]
  // Returns array of 4 predefined roles

getPermissionsForRole(roleId: string): Permission[]
  // Returns permissions for a specific role

getUserById(id: string): Observable<User>
  // Fetches user data for editing

createUser(request: CreateUserRequest): Observable<User>
  // Creates new user

updateUser(id: string, request: UpdateUserRequest): Observable<User>
  // Updates existing user

deleteUser(id: string): Observable<{ success: boolean }>
  // Deletes user
```

---

## 🔒 Security Considerations

### Route Protection

1. **AdminGuard**
   - Checks authentication status
   - Verifies admin role
   - Redirects unauthorized users
   - Protects parent AND child routes

2. **Permission Checks**
   - UI elements hidden based on permissions
   - Backend validates all requests
   - Cannot bypass with direct navigation

### Password Security

1. **Frontend**
   - Minimum 6 characters
   - Confirmation required
   - Never displayed in plain text

2. **Backend**
   - Hashed with bcrypt (12 rounds)
   - Never returned in API responses
   - Never logged

### Data Validation

1. **Frontend Validation**
   - Reactive forms with validators
   - Real-time feedback
   - Prevents invalid submissions

2. **Backend Validation**
   - Re-validates all data
   - Sanitizes input
   - Returns specific error messages

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot access user management"

**Problem**: AdminGuard blocking access

**Solutions**:

- Verify you're logged in as admin user
- Check browser console for errors
- Verify admin role in user profile
- Clear local storage and re-login

#### 2. "User not found" when editing

**Problem**: Invalid user ID or deleted user

**Solutions**:

- Refresh user list
- Verify user still exists
- Check for network errors
- Try navigating from user list

#### 3. "Failed to create user"

**Problem**: Backend validation or duplicate username/email

**Solutions**:

- Check all required fields filled
- Verify email format valid
- Ensure username unique
- Check password requirements
- Review browser console for details

#### 4. "Permissions not saving"

**Problem**: At least one permission required

**Solutions**:

- Select at least one permission
- Use quick role to auto-select
- Check form validation messages
- Verify permissions checkboxes working

### Debug Mode

```typescript
// Enable debug logging in UserFormComponent
ngOnInit(): void {
  console.log('Form Mode:', this.isEditMode ? 'Edit' : 'Create');
  console.log('User ID:', this.userId);
  console.log('Available Permissions:', this.availablePermissions);
}
```

---

## 📚 Related Documentation

- **[User Profile Guide](PERMISSIONS-MODAL-FEATURE.md)**: User's own profile management
- **[Admin Role Management](ADMIN-ROLE-MANAGEMENT-QUICK-REF.md)**: Quick reference for role changes
- **[AdminGuard Testing](ADMIN-GUARD-TESTING.md)**: Guard implementation and tests
- **[Authentication Guide](../3d-inventory-api/SECURITY.md)**: Backend authentication

---

## ✅ Summary

### What's Available

✅ **User List**

- View all users in sortable table
- Search and filter capabilities
- Permission viewing
- Quick role editing
- Full CRUD operations

✅ **Add User Form**

- Create new users
- Assign permissions
- Set role presets
- Password validation
- Success/error handling

✅ **Edit User Form**

- Update existing users
- Modify permissions
- Change roles
- Optional password update
- Pre-populated form data

✅ **Security**

- AdminGuard protection
- Permission-based UI
- Validation on client and server
- Secure password handling

✅ **UX Features**

- Responsive design
- Visual feedback
- Loading states
- Error messages
- Success confirmations

### Quick Actions

**Create User**:

```
/admin/users → [Add User] → Fill form → [Create User]
```

**Edit User**:

```
/admin/users → Find user → [Edit] → Modify → [Update User]
```

**Delete User**:

```
/admin/users → Find user → [Delete] → Confirm
```

---

**Status**: ✅ **PRODUCTION READY**
**Documentation**: ✅ **COMPLETE**
**Testing**: ✅ **FULLY TESTED**
**Security**: ✅ **ADMIN PROTECTED**

---

_Last Updated: October 12, 2025_
_Feature: Complete Admin User Management System_
