# User Management Forms - Permissions & Roles

## ✅ COMPLETE - Admin-Only User Management

### Overview

The 3D Inventory application includes comprehensive user management forms for **admin users only**, allowing them to:

- ✅ **Create new users** with custom permissions and roles
- ✅ **Edit existing users** including permissions and role assignment
- ✅ **Assign predefined roles** (Viewer, Editor, Admin, System Admin)
- ✅ **Customize individual permissions** for fine-grained access control
- ✅ **Manage user accounts** (username, email, password)

### Key Features

#### 1. **Role-Based Access Control (RBAC)**

**Predefined Roles** available for quick assignment:

| Role              | Description        | Permissions                                                 |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| **Viewer**        | Read-only access   | Read all data (devices, models, connections, etc.)          |
| **Editor**        | Can modify data    | Read + Create + Update (except users and delete operations) |
| **Administrator** | Full system access | All permissions including user management                   |
| **System Admin**  | Complete control   | System-level administration                                 |

#### 2. **Granular Permission Management**

**Permission Categories**:

- **User Management**: Read, Create, Update, Delete users
- **Device Management**: Read, Create, Update, Delete devices
- **Model Management**: Read, Create, Update, Delete models
- **Connection Management**: Read, Create, Update, Delete connections
- **Attribute Management**: Read, Create, Update, Delete attributes
- **Floor Management**: Read, Create, Update, Delete floors
- **Log Management**: Read, Create logs
- **Admin**: Full administrative access
- **System**: System-level administration

### Form Components

#### **User Form Component** (`user-form.component.ts`)

**Location**: `src/app/components/users/user-form.component.ts`

**Routes**:

- **Add User**: `/admin/users/new`
- **Edit User**: `/admin/users/edit/:id`

**Features**:

1. **Basic Information Section**:
   - Username (required, 2-100 characters)
   - Email (required, valid email format)
   - Password (required for new users, optional for edit)
   - Confirm Password (validation)

2. **Permissions & Roles Section**:
   - **Quick Role Selection**: Dropdown with predefined roles
   - **Individual Permissions**: Checkboxes organized by category
   - **Auto-populate**: Selecting a role auto-checks permissions
   - **Custom Assignment**: Manually select/deselect individual permissions

3. **Form Validation**:
   - Username: Required, min 2 chars, max 100 chars
   - Email: Required, valid email format
   - Password: Min 6 chars (required for new, optional for edit)
   - Password Match: Confirm password must match
   - Permissions: At least one permission required

4. **Visual Feedback**:
   - Loading states
   - Success messages
   - Error messages
   - Validation errors with specific guidance
   - Saving indicators

#### **User List Component** (`user-list.component.ts`)

**Location**: `src/app/components/users/user-list.component.ts`

**Route**: `/admin/users`

**Features**:

1. **User Management Actions**:
   - View all users
   - Edit user roles and permissions (modal)
   - Delete users
   - Create new users (navigation to form)

2. **Role/Permission Edit Modal**:
   - Quick role reassignment
   - Individual permission toggles
   - Real-time permission updates
   - Save changes with API integration

3. **User Display**:
   - Username and email
   - Current role badge
   - Permission count
   - Account status (active/inactive)
   - Action buttons (edit, delete)

### Usage Guide

#### **Creating a New User** (Admin Only)

1. Navigate to: **https://3d-inventory.ultimasolution.pl/admin/users**
2. Click **"Add User"** button
3. Fill in basic information:
   ```
   Username: newuser
   Email: newuser@example.com
   Password: SecurePass123!
   Confirm Password: SecurePass123!
   ```
4. **Option A**: Quick Role Assignment
   - Select a predefined role from dropdown
   - Permissions automatically populated
5. **Option B**: Custom Permissions
   - Manually check/uncheck individual permissions
   - Mix and match as needed
6. Click **"Create User"**
7. Success message → Redirects to user list

#### **Editing Existing User** (Admin Only)

1. Navigate to: **https://3d-inventory.ultimasolution.pl/admin/users**
2. Find user in list
3. Click **"Edit"** button
4. Modify information:
   - Change username/email
   - Update password (leave empty to keep current)
   - Change role assignment
   - Adjust individual permissions
5. Click **"Update User"**
6. Success message → Redirects to user list

#### **Quick Role/Permission Edit** (Modal)

1. From user list, click **"Edit Role"** icon
2. Modal opens with current user data
3. Select new role from dropdown (auto-updates permissions)
4. OR manually toggle individual permissions
5. Click **"Save Changes"**
6. Changes applied immediately

### Security & Access Control

#### **Route Protection**

All user management routes are protected by **AdminGuard**:

```typescript
// app-routing.module.ts
{
  path: 'admin',
  canActivate: [AdminGuard],
  children: [
    { path: 'users', component: UserListComponent },
    { path: 'users/new', component: UserFormComponent },
    { path: 'users/edit/:id', component: UserFormComponent }
  ]
}
```

**Requirements**:

- User must be authenticated (valid JWT token)
- User must have `role: 'admin'`
- User must have `admin:access` permission

#### **Permission Checking**

The application checks permissions at multiple levels:

1. **Route Level**: AdminGuard checks role
2. **Component Level**: Checks specific permissions
3. **UI Level**: Buttons/actions hidden if no permission
4. **API Level**: Backend validates all requests

### API Integration

#### **Endpoints Used**

1. **Get All Users**:

   ```
   GET /user-management
   Authorization: Bearer <token>
   ```

2. **Create User**:

   ```
   POST /user-management
   Content-Type: application/json
   Authorization: Bearer <token>

   {
     "username": "newuser",
     "email": "newuser@example.com",
     "password": "SecurePass123!",
     "permissions": ["read:devices", "write:devices", ...],
     "role": "editor"
   }
   ```

3. **Update User**:

   ```
   PUT /user-management/:id
   Content-Type: application/json
   Authorization: Bearer <token>

   {
     "username": "updateduser",
     "email": "updated@example.com",
     "permissions": ["read:devices", ...],
     "role": "admin"
   }
   ```

4. **Delete User**:
   ```
   DELETE /user-management/:id
   Authorization: Bearer <token>
   ```

### Form Fields Reference

#### **UserFormComponent Fields**

```typescript
interface UserFormData {
  // Basic Information
  username: string // Required, 2-100 chars
  email: string // Required, valid email
  password: string // Required for new, optional for edit
  confirmPassword: string // Must match password

  // Permissions & Roles
  role: string // Optional, predefined role ID
  permissions: boolean[] // Array of permission checkboxes
}
```

#### **Validation Rules**

| Field           | Validation               | Error Message                                            |
| --------------- | ------------------------ | -------------------------------------------------------- |
| username        | Required, min 2, max 100 | "Username is required and must be at least 2 characters" |
| email           | Required, email format   | "Please enter a valid email address"                     |
| password        | Min 6 chars (new user)   | "Password is required and must be at least 6 characters" |
| confirmPassword | Must match password      | "Passwords do not match"                                 |
| permissions     | At least one selected    | "At least one permission must be selected"               |

### Permission Enum Reference

```typescript
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
  SYSTEM_ADMIN = 'system:admin',
}
```

### UI/UX Features

#### **Visual Indicators**

- ✅ **Required Fields**: Red asterisk (\*)
- ✅ **Field Validation**: Red border + error message
- ✅ **Success**: Green alert message
- ✅ **Error**: Red alert message
- ✅ **Loading**: Spinner with descriptive text
- ✅ **Saving**: Button disabled + spinner

#### **Permission Grid Layout**

Permissions organized by category for easy scanning:

```
┌─ Device ─────────────────┐
│ ☑ Read Devices           │
│ ☑ Create Devices         │
│ ☑ Update Devices         │
│ ☐ Delete Devices         │
└──────────────────────────┘

┌─ Model ──────────────────┐
│ ☑ Read Models            │
│ ☐ Create Models          │
│ ☐ Update Models          │
│ ☐ Delete Models          │
└──────────────────────────┘
```

#### **Role Selection Behavior**

When user selects a predefined role:

1. Role dropdown value updated
2. All permissions unchecked
3. Role-specific permissions auto-checked
4. User can still manually adjust permissions
5. Manual changes clear role selection

### Testing Checklist

#### **Create User Flow**

- [ ] Navigate to /admin/users
- [ ] Click "Add User" button
- [ ] Form displays with empty fields
- [ ] Fill username, email, password
- [ ] Select "Editor" role
- [ ] Verify permissions auto-populated
- [ ] Submit form
- [ ] Success message displays
- [ ] Redirects to user list
- [ ] New user appears in list

#### **Edit User Flow**

- [ ] Navigate to /admin/users
- [ ] Click "Edit" on existing user
- [ ] Form pre-populated with user data
- [ ] Change email address
- [ ] Select "Admin" role
- [ ] Verify admin permissions checked
- [ ] Submit form
- [ ] Success message displays
- [ ] User list shows updated email
- [ ] User list shows "Admin" role badge

#### **Permission Modal Flow**

- [ ] Click "Edit Role" icon on user
- [ ] Modal opens
- [ ] Current role selected
- [ ] Current permissions checked
- [ ] Change role to "Viewer"
- [ ] Permissions update to viewer set
- [ ] Save changes
- [ ] Modal closes
- [ ] User list reflects new role

### Troubleshooting

#### **Issue: "Access Denied" when accessing /admin/users**

**Cause**: User doesn't have admin role

**Solution**:

1. Verify admin role in database:
   ```bash
   cd /home/karol/GitHub/3d-inventory-api
   npm run verify:admin
   ```
2. Clear browser cache and re-login
3. Check JWT token has `role: "admin"`

#### **Issue: "Failed to create user"**

**Causes**:

- Username already exists
- Invalid email format
- Password too short
- API connection error

**Solutions**:

- Check validation errors in form
- Verify unique username
- Ensure password ≥ 6 characters
- Check API server is running

#### **Issue: Permissions not saving**

**Causes**:

- No permissions selected
- API error
- Network timeout

**Solutions**:

- Select at least one permission
- Check browser console for errors
- Verify API endpoint working
- Try with predefined role first

### Files Overview

| File                       | Purpose                              | Lines |
| -------------------------- | ------------------------------------ | ----- |
| `user-form.component.ts`   | Form logic and validation            | 450   |
| `user-form.component.html` | Form template with Bootstrap styling | 200   |
| `user-form.component.scss` | Custom form styles                   | ~100  |
| `user-list.component.ts`   | User list and quick edit modal       | 566   |
| `user-list.component.html` | User table and modals                | ~300  |
| `user.ts`                  | Interfaces, enums, predefined roles  | 234   |
| `user.service.ts`          | API integration                      | ~250  |
| `admin.guard.ts`           | Route protection                     | 107   |

### Summary

✅ **Complete user management system** for admin users
✅ **Create and edit users** with full validation
✅ **Role-based access control** with predefined roles
✅ **Granular permissions** for fine-tuned control
✅ **Production deployed** and ready to use
✅ **Admin-only access** protected by AdminGuard

### Next Steps

1. **Test on production**:
   - https://3d-inventory.ultimasolution.pl/admin/users
   - Login as admin
   - Create test user
   - Edit permissions

2. **Clear browser cache** if deployed recently:

   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

3. **Verify admin access** working after latest deployment

---

**Status**: ✅ READY FOR USE
**Access**: Admin role required
**Production URL**: https://3d-inventory.ultimasolution.pl/admin/users
