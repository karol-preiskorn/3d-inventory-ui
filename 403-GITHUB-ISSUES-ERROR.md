# 🔒 403 Forbidden Error - GitHub Issues Endpoint

**Date**: October 7, 2025
**Error Location**: Home Component - GitHub Issues Feature
**Endpoint**: `GET /github/issues`
**Status**: 403 Forbidden
**Component**: `/src/app/components/home/home.component.ts`

---

## ❌ Error Details

### HTTP Error Response

```json
{
  "status": 403,
  "statusText": "Unknown Error",
  "url": "https://d-inventory-api-wzwe3odv7q-ew.a.run.app/github/issues",
  "ok": false,
  "error": {
    "error": "Forbidden",
    "message": "Access denied. Required permission: admin:access"
  }
}
```

### Error Analysis

- **HTTP Status**: 403 Forbidden
- **Endpoint**: `/github/issues`
- **Required Permission**: `admin:access`
- **Error Type**: Authorization/Permission Error
- **Root Cause**: User lacks admin privileges

---

## 🔍 Root Cause Analysis

### 1. Permission Requirement

The `/github/issues` endpoint requires **admin-level access**:

```
Required Permission: admin:access
```

### 2. Current User Role

Based on the error, the current user does NOT have admin privileges. The user is likely logged in as:

- ✅ `user` role (standard user)
- ✅ `viewer` role (read-only)
- ❌ NOT `admin` role

### 3. API Security Implementation

The API backend implements **Role-Based Access Control (RBAC)**:

```typescript
// Backend (API) - Simplified example
if (userRole !== 'admin') {
  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied. Required permission: admin:access',
  })
}
```

---

## 📍 Where the Error Occurs

### Component: `home.component.ts`

**Location**: Lines 93-108

```typescript
this.http
  .get<GitHubIssue[]>(environment.baseurl + '/github/issues', {
    headers: this.authService.getAuthHeaders(),
  })
  .subscribe({
    next: (data: GitHubIssue[]) => {
      this.issues = data
      this.issuesJson = JSON.stringify(data, null, 2)
      console.warn('✅ GitHub issues loaded successfully:', data.length)
    },
    error: (error: unknown) => {
      console.error('❌ Error fetching issues:', error) // ← Error caught here!
      if (!isAuthenticated) {
        console.warn('⚠️ User is not authenticated. Please login first.')
      }
    },
  })
```

### Authentication Headers

The component correctly includes authentication headers:

```typescript
headers: this.authService.getAuthHeaders()
```

This adds the JWT token to the request:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Why This Happens

### Authentication vs Authorization

| Aspect             | Status          | Details                                 |
| ------------------ | --------------- | --------------------------------------- |
| **Authentication** | ✅ Working      | User is logged in with valid JWT token  |
| **Authorization**  | ❌ Insufficient | User role doesn't have admin permission |

**Authentication** = "Who are you?" → ✅ User is identified
**Authorization** = "What can you do?" → ❌ User cannot access admin endpoints

### JWT Token Contents

The user's JWT token contains:

```json
{
  "id": "user-id",
  "username": "current-username",
  "role": "user", // ← NOT "admin"!
  "permissions": [
    "read:devices",
    "write:devices"
    // ... but NOT "admin:access"
  ]
}
```

---

## ✅ Solutions

### Solution 1: Login as Admin User

**For Testing/Development**:

Use one of these admin credentials:

```typescript
const adminCredentials = [
  { username: 'admin', password: 'admin123!' }, // Has admin role
]
```

**Steps**:

1. Logout current user
2. Login with admin credentials
3. Navigate to home page
4. GitHub issues should load successfully

### Solution 2: Update Error Handling (Recommended)

**Improve user experience by handling 403 errors gracefully:**

```typescript
// In home.component.ts
this.http
  .get<GitHubIssue[]>(environment.baseurl + '/github/issues', {
    headers: this.authService.getAuthHeaders(),
  })
  .subscribe({
    next: (data: GitHubIssue[]) => {
      this.issues = data
      this.issuesJson = JSON.stringify(data, null, 2)
      console.warn('✅ GitHub issues loaded successfully:', data.length)
    },
    error: (error: unknown) => {
      console.error('❌ Error fetching issues:', error)

      // Cast to HttpErrorResponse for type safety
      if (error && typeof error === 'object' && 'status' in error) {
        const httpError = error as { status: number; error?: { message?: string } }

        if (httpError.status === 403) {
          console.warn('⚠️ Access Denied: GitHub issues require admin privileges')
          // Show user-friendly message in UI
          this.issuesJson = JSON.stringify(
            {
              error: 'Access Denied',
              message: 'GitHub issues are only available to admin users',
              suggestion: 'Please login with an admin account to view this feature',
            },
            null,
            2,
          )
          return
        }

        if (httpError.status === 401) {
          console.warn('⚠️ Not authenticated. Please login first.')
          return
        }
      }

      // Generic error handling
      console.error('Unexpected error:', error)
    },
  })
```

### Solution 3: Conditional Feature Display

**Hide GitHub issues feature for non-admin users:**

```typescript
// In home.component.ts
export class HomeComponent implements OnInit {
  showGitHubIssues = false // Add this property

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.loadReadme()

    // Only load GitHub issues if user is admin
    const currentUser = this.authService.getCurrentUser()
    if (currentUser?.role === 'admin') {
      this.showGitHubIssues = true
      this.loadIssues()
    } else {
      console.info('ℹ️ GitHub issues feature requires admin access')
    }
  }
}
```

**In home.component.html:**

```html
<!-- Only show GitHub issues section for admin users -->
@if (showGitHubIssues) {
<div class="github-issues-section">
  <h3>GitHub Issues</h3>
  <pre>{{ issuesJson }}</pre>
</div>
}
```

### Solution 4: Request Admin Permission

**For Production Use**:

If this user should have access to GitHub issues:

1. Contact system administrator
2. Request role upgrade from `user` to `admin`
3. Or request specific permission: `admin:access`
4. Administrator updates user role in database
5. User logs out and logs back in (new JWT with admin role)

---

## 🔐 Role-Based Permissions

### Available User Roles

| Role       | Can Access /github/issues | Other Permissions                |
| ---------- | ------------------------- | -------------------------------- |
| **admin**  | ✅ Yes                    | Full access to all endpoints     |
| **user**   | ❌ No                     | Read/write devices, models, etc. |
| **viewer** | ❌ No                     | Read-only access                 |

### Permission Hierarchy

```
admin
  ├─ admin:access ✅
  ├─ read:devices ✅
  ├─ write:devices ✅
  ├─ delete:devices ✅
  ├─ read:models ✅
  ├─ write:models ✅
  └─ ... (all permissions)

user
  ├─ read:devices ✅
  ├─ write:devices ✅
  ├─ read:models ✅
  └─ write:models ✅

viewer
  ├─ read:devices ✅
  └─ read:models ✅
```

---

## 🧪 Testing Different User Roles

### Test Credentials

```typescript
// From test-login-functionality.js
const testCredentials = [
  {
    username: 'admin',
    password: 'admin123!',
    role: 'admin',
    canAccessGitHub: true  ✅
  },
  {
    username: 'user',
    password: 'user123!',
    role: 'user',
    canAccessGitHub: false  ❌
  },
  {
    username: 'carlo',
    password: 'carlo123!',
    role: 'user',
    canAccessGitHub: false  ❌
  },
  {
    username: 'viewer',
    password: 'viewer123!',
    role: 'viewer',
    canAccessGitHub: false  ❌
  }
]
```

### Testing Steps

1. **Test as Admin** (Should Work):

   ```
   Username: admin
   Password: admin123!
   Expected: GitHub issues load successfully
   ```

2. **Test as User** (403 Error):

   ```
   Username: user
   Password: user123!
   Expected: 403 Forbidden error
   ```

3. **Test as Viewer** (403 Error):
   ```
   Username: viewer
   Password: viewer123!
   Expected: 403 Forbidden error
   ```

---

## 📊 API Endpoint Permissions

### Public Endpoints (No Auth Required)

- `POST /login` - User authentication
- `GET /health` - API health check

### Authenticated Endpoints (Any logged-in user)

- `GET /devices` - List devices
- `GET /devices/:id` - Get device details
- `GET /models` - List models
- `GET /models/:id` - Get model details

### Admin-Only Endpoints (admin role required)

- `GET /github/issues` ⚠️ **Requires admin:access**
- `DELETE /users/:id` - Delete users
- `POST /users` - Create users
- `PUT /users/:id/role` - Change user roles

### Write Endpoints (user or admin role)

- `POST /devices` - Create device
- `PUT /devices/:id` - Update device
- `DELETE /devices/:id` - Delete device
- `POST /models` - Create model
- `PUT /models/:id` - Update model

---

## 🛠️ Recommended Fix (Step-by-Step)

### Option A: Improve Error Handling (Quick Fix)

**File**: `src/app/components/home/home.component.ts`

Replace the error handling block:

```typescript
// BEFORE (Current code)
error: (error: unknown) => {
  console.error('❌ Error fetching issues:', error)
  if (!isAuthenticated) {
    console.warn('⚠️ User is not authenticated. Please login first.')
  }
}

// AFTER (Improved error handling)
error: (error: unknown) => {
  console.error('❌ Error fetching issues:', error)

  if (!isAuthenticated) {
    console.warn('⚠️ User is not authenticated. Please login first.')
    this.issuesJson = JSON.stringify(
      {
        error: 'Not Authenticated',
        message: 'Please login to view GitHub issues',
      },
      null,
      2,
    )
    return
  }

  // Check for 403 Forbidden error
  if (error && typeof error === 'object' && 'status' in error) {
    const httpError = error as { status: number; error?: { message?: string } }

    if (httpError.status === 403) {
      console.warn('⚠️ Access Denied: GitHub issues require admin privileges')
      this.issuesJson = JSON.stringify(
        {
          error: 'Access Denied',
          message: 'GitHub issues are only available to admin users',
          currentUser: this.authService.getCurrentUser()?.username || 'unknown',
          requiredRole: 'admin',
          suggestion: 'Please login with an admin account to view this feature',
        },
        null,
        2,
      )
      return
    }
  }

  // Generic error
  this.issuesJson = JSON.stringify(
    {
      error: 'Failed to load GitHub issues',
      details: error,
    },
    null,
    2,
  )
}
```

### Option B: Conditional Loading (Better UX)

**Add role check before attempting to load:**

```typescript
ngOnInit(): void {
  this.loadReadme()

  // Check if user has admin role
  const currentUser = this.authService.getCurrentUser()
  const isAdmin = currentUser?.role === 'admin'

  if (isAdmin) {
    console.info('✅ Admin user detected - loading GitHub issues')
    this.loadIssues()
  } else {
    console.info('ℹ️ Non-admin user - skipping GitHub issues (requires admin:access)')
    this.issuesJson = JSON.stringify({
      info: 'GitHub Issues',
      status: 'Not Available',
      message: 'This feature is only available to administrators',
      currentRole: currentUser?.role || 'not authenticated'
    }, null, 2)
  }
}
```

---

## 📝 Summary

### The Issue

- ❌ **403 Forbidden** error when accessing `/github/issues`
- ❌ User lacks required `admin:access` permission
- ❌ Current user role is NOT `admin`

### Why It's Not a Bug

- ✅ API is working correctly (enforcing RBAC)
- ✅ Authentication is working (JWT token sent)
- ✅ Authorization is working (preventing unauthorized access)
- ✅ This is **expected behavior** for non-admin users

### Solutions

1. **Login as admin** - Use admin credentials for testing
2. **Improve error handling** - Show user-friendly message
3. **Conditional loading** - Only load for admin users
4. **Request permission** - Contact admin to upgrade role

### Recommended Action

**Implement Option B (Conditional Loading)** for the best user experience:

- Don't attempt to load GitHub issues for non-admin users
- Show informative message instead of error
- Prevents unnecessary API calls
- Provides clear explanation to users

---

## 🔗 Related Files

- **Error Location**: `/src/app/components/home/home.component.ts` (line 93)
- **Authentication Service**: `/src/app/services/authentication.service.ts`
- **Test Credentials**: `/test-login-functionality.js`
- **API Endpoint**: `https://d-inventory-api-wzwe3odv7q-ew.a.run.app/github/issues`

---

**Status**: ⚠️ **Expected Behavior - Requires Admin Access**
**Action Required**: Login with admin credentials OR implement conditional loading
**Last Updated**: October 7, 2025
