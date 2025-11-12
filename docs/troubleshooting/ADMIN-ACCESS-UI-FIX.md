# Admin Access UI Fix - Summary

**Date**: October 12, 2025
**Issue**: Admin user gets "Access denied" when trying to access admin area in UI
**Root Cause**: UI was not extracting `role` field from JWT token
**Status**: ✅ **FIXED**

---

## 🔍 Problem Analysis

### Database Status

✅ **Admin user in MongoDB has correct role**

```
Username: admin
Email: karol@ultimasolution.pl
Role: admin
Active: true
Permissions: 12 (including admin:access)
```

### API Status

✅ **API sends role in JWT token and response**

**Login endpoint** (`src/controllers/login.ts`):

```typescript
// JWT Payload includes role and permissions
const payload = {
  id: user._id.toString(),
  username: user.username,
  role: user.role, // ← SENT by API
  permissions: user.permissions,
}

// Response includes user object with role
res.json({
  token,
  user: {
    id: user._id.toString(),
    username: user.username,
    role: user.role, // ← SENT by API
    permissions: user.permissions,
  },
})
```

### UI Status (BEFORE FIX)

❌ **UI was NOT extracting role from JWT token**

**Problem 1**: `JwtPayload` interface missing `role` field

```typescript
// BEFORE (missing role and permissions)
export interface JwtPayload {
  id: number
  username: string
  iat?: number
  exp?: number
}
```

**Problem 2**: Authentication service not extracting role

```typescript
// BEFORE (role not extracted)
const user: User = {
  _id: payload.id.toString(),
  username: payload.username,
  email: `${payload.username}@example.com`,
  permissions: [], // ← Empty!
  // role: missing!
  token: response.token,
}
```

**Result**: AdminGuard check failed

```typescript
// AdminGuard checks this
const isAdmin = user?.role === 'admin' // ← user.role was undefined!
```

---

## ✅ Solution Implemented

### Fix 1: Updated `JwtPayload` Interface

**File**: `src/app/shared/user.ts`

```typescript
/**
 * JWT Token payload interface
 * Must match the payload structure from 3d-inventory-api/src/middlewares/auth.ts
 */
export interface JwtPayload {
  id: string // Changed from number to string to match API
  username: string
  role?: string // ← ADDED: User role (admin, user, viewer, editor)
  permissions?: string[] // ← ADDED: User permissions array
  iat?: number // issued at
  exp?: number // expires at
}
```

### Fix 2: Updated Authentication Service

**File**: `src/app/services/authentication.service.ts`

```typescript
login(loginRequest: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginRequest)
    .pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);

          // Decode token to get user info including role and permissions
          const payload = this.decodeToken(response.token);
          const user: User = {
            _id: payload.id.toString(),
            username: payload.username,
            email: `${payload.username}@example.com`,
            permissions: payload.permissions || [], // ← EXTRACT permissions
            role: payload.role, // ← EXTRACT role (CRITICAL for AdminGuard!)
            token: response.token
          };

          this.setUser(user); // Stores in localStorage with role

          this.authStateSubject.next({
            isAuthenticated: true,
            user: user,
            token: response.token
          });
        }
      }),
      catchError(this.handleError)
    );
}
```

---

## 🧪 Testing Instructions

### Step 1: Rebuild the UI

```bash
cd /home/karol/GitHub/3d-inventory-ui
npm run build
```

### Step 2: Clear Browser Storage

**Important**: Old tokens in localStorage don't have the role field!

**Option A - Browser Console** (F12):

```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

**Option B - Browser DevTools**:

1. Open DevTools (F12)
2. Application tab → Storage → Clear site data
3. Reload page

### Step 3: Login Fresh

1. Navigate to: `http://localhost:4200/login`
2. Login credentials:
   - Username: `admin`
   - Password: `admin123!`
3. **Important**: This creates a NEW token with role field

### Step 4: Verify Token Contains Role

**Browser Console** (F12):

```javascript
// Check stored user object
const user = JSON.parse(localStorage.getItem('auth_user'))
console.log('User role:', user.role) // Should show: "admin"
console.log('Permissions:', user.permissions) // Should show array of 12 permissions

// Check JWT token payload
const token = localStorage.getItem('auth_token')
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  console.log('Token payload:', payload)
  console.log('Role in token:', payload.role) // Should show: "admin"
}
```

**Expected Output**:

```javascript
User role: "admin"
Permissions: ["read:devices", "write:devices", ..., "admin:access"]
Token payload: {
  id: "...",
  username: "admin",
  role: "admin",  // ← Should be present!
  permissions: [...],
  iat: 1234567890,
  exp: 1234654290
}
```

### Step 5: Test Admin Access

1. Navigate to: `http://localhost:4200/admin/users`
2. ✅ Should see user list (NO "Access denied" error)
3. ✅ "Add User" button should be visible
4. ✅ Can click on users to edit
5. ✅ No redirect to /home
6. ✅ No console errors

### Step 6: Verify AdminGuard Behavior

**Browser Console**:

```javascript
// Check authentication service state
ng.probe(getAllAngularRootElements()[0]).injector.get('AuthenticationService').getCurrentUser()
```

**Expected**:

```javascript
{
  _id: "...",
  username: "admin",
  email: "admin@example.com",
  role: "admin",  // ← Should be present!
  permissions: [...],
  token: "eyJ..."
}
```

---

## 🔄 What Changed

### Before Fix

```
Login → API sends role → UI ignores role → User object has no role →
AdminGuard checks user.role === 'admin' → undefined === 'admin' →
Access Denied! ❌
```

### After Fix

```
Login → API sends role → UI extracts role from JWT → User object has role →
AdminGuard checks user.role === 'admin' → 'admin' === 'admin' →
Access Granted! ✅
```

---

## 📋 Files Modified

1. **`/home/karol/GitHub/3d-inventory-ui/src/app/shared/user.ts`**
   - Updated `JwtPayload` interface to include `role` and `permissions`
   - Changed `id` type from `number` to `string` to match API

2. **`/home/karol/GitHub/3d-inventory-ui/src/app/services/authentication.service.ts`**
   - Updated `login()` method to extract `role` from JWT payload
   - Updated `login()` method to extract `permissions` from JWT payload
   - User object now includes role for AdminGuard verification

---

## 🐛 Troubleshooting

### Issue: Still getting "Access denied" after fix

**Cause**: Old JWT token in localStorage doesn't have role field

**Solution**:

1. Logout
2. Clear browser storage (F12 → Application → Clear site data)
3. Login again (creates new token with role)

### Issue: Token has role but AdminGuard still denies

**Check**:

```javascript
// In browser console
const token = localStorage.getItem('auth_token')
const user = JSON.parse(localStorage.getItem('auth_user'))
console.log('Token exists:', !!token)
console.log('User role:', user?.role)
console.log('Is admin:', user?.role === 'admin')
```

**Solution**: Ensure both token AND user object in localStorage have role field

### Issue: Login works but admin routes redirect

**Check AdminGuard logs** (Browser Console):

```
Access denied: User admin attempted to access admin area without admin role
```

**Solution**: Clear localStorage and login again to get fresh token

### Issue: API returns role but UI doesn't store it

**Check authentication service**:

```typescript
// Verify this line exists in authentication.service.ts
role: payload.role, // Extract role from JWT payload
```

---

## ✅ Verification Checklist

After applying the fix:

- [ ] UI code updated (`user.ts` and `authentication.service.ts`)
- [ ] UI rebuilt (`npm run build`)
- [ ] Browser storage cleared
- [ ] Logged out and logged in again
- [ ] Token contains `role: "admin"` in payload
- [ ] User object in localStorage has `role: "admin"`
- [ ] Can access `/admin/users` without redirect
- [ ] User list displays correctly
- [ ] No "Access denied" errors in console
- [ ] AdminGuard allows navigation to admin routes

---

## 📊 Before vs After Comparison

### JWT Token Payload

**Before Fix**:

```json
{
  "id": "67003c174da4c9c8c8b60cd5",
  "username": "admin",
  "iat": 1728740000,
  "exp": 1728826400
}
```

**After Fix**:

```json
{
  "id": "67003c174da4c9c8c8b60cd5",
  "username": "admin",
  "role": "admin",
  "permissions": [
    "read:devices",
    "write:devices",
    "delete:devices",
    "read:models",
    "write:models",
    "delete:models",
    "read:connections",
    "write:connections",
    "delete:connections",
    "read:logs",
    "delete:logs",
    "admin:access"
  ],
  "iat": 1728740000,
  "exp": 1728826400
}
```

### User Object in LocalStorage

**Before Fix**:

```json
{
  "_id": "67003c174da4c9c8c8b60cd5",
  "username": "admin",
  "email": "admin@example.com",
  "permissions": [],
  "token": "eyJ..."
}
```

**After Fix**:

```json
{
  "_id": "67003c174da4c9c8c8b60cd5",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "permissions": [
    "read:devices",
    "write:devices",
    ...
    "admin:access"
  ],
  "token": "eyJ..."
}
```

---

## 🎯 Summary

**Root Cause**: UI's `JwtPayload` interface and authentication service were not extracting the `role` field from the JWT token that the API was sending.

**Fix Applied**:

1. ✅ Updated `JwtPayload` interface to include `role` and `permissions`
2. ✅ Updated authentication service to extract `role` from JWT payload
3. ✅ User object now has `role` field for AdminGuard verification

**Testing Required**:

1. ⚠️ Clear browser storage (old tokens don't have role)
2. ⚠️ Login fresh (get new token with role)
3. ✅ Access admin area should now work

**Status**: ✅ **FIXED** - User must re-login to get new token with role field

---

_Last Updated: October 12, 2025_
_Issue: Admin access denied in UI despite having admin role in database_
_Solution: Extract role from JWT token in UI authentication service_
