# Admin User Permissions Fix

## Problem Identified

**Issue**: Admin user cannot edit user profiles and permissions despite having admin role.

### Root Cause

**Permission Format Mismatch** between API and UI:

#### API Permissions (Old Format)

```json
{
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
    "admin:access" // ← Generic admin permission
  ]
}
```

#### UI Expected Permissions (New Format)

```typescript
export enum Permission {
  // User management - UI EXPECTS THESE
  USER_READ = 'user:read',
  USER_CREATE = 'user:create', // ← MISSING FROM API!
  USER_UPDATE = 'user:update', // ← MISSING FROM API!
  USER_DELETE = 'user:delete', // ← MISSING FROM API!

  // Device management
  DEVICE_READ = 'device:read',
  DEVICE_CREATE = 'device:create',
  DEVICE_UPDATE = 'device:update',
  DEVICE_DELETE = 'device:delete',
  // ... etc
}
```

### Impact

1. **User List Component** (`user-list.component.ts`):

   ```typescript
   // Lines 95-97
   this.canCreateUser = this.authService.hasPermission(Permission.USER_CREATE) // FALSE ❌
   this.canUpdateUser = this.authService.hasPermission(Permission.USER_UPDATE) // FALSE ❌
   this.canDeleteUser = this.authService.hasPermission(Permission.USER_DELETE) // FALSE ❌
   ```

2. **User Form Component** (`user-form.component.ts`):
   - Can't access edit form (permission denied)
   - Can't save user changes (permission denied)

3. **Authentication Service** (`authentication.service.ts`):
   ```typescript
   // Line 138-141
   hasPermission(permission: string): boolean {
     const user = this.getCurrentUser();
     return user?.permissions?.includes(permission) || false;
     // Looks for 'user:update' but API sends 'admin:access' ❌
   }
   ```

## Solutions

### Option 1: Quick Fix - Admin Role Bypass (RECOMMENDED)

**Modify** `authentication.service.ts` to grant all permissions to admin role:

```typescript
/**
 * Check if user has specific permission
 * Admin role automatically has all permissions
 */
hasPermission(permission: string): boolean {
  const user = this.getCurrentUser();

  // Admin role has all permissions
  if (user?.role === 'admin') {
    return true;
  }

  return user?.permissions?.includes(permission) || false;
}
```

**Pros**:

- ✅ Quick fix (5 minute change)
- ✅ No API changes needed
- ✅ Matches expected behavior (admin has all permissions)
- ✅ No breaking changes to UI code

**Cons**:

- ⚠️ Role-based check instead of permission-based
- ⚠️ Doesn't fix underlying permission format mismatch

### Option 2: Fix API Permissions (PROPER FIX)

**Update API** to use new permission format in `UserService.ts`:

```typescript
// Current (WRONG)
const defaultPermissions = ['read:devices', 'write:devices', 'delete:devices', 'admin:access']

// Fixed (CORRECT)
const adminPermissions = [
  'user:read',
  'user:create',
  'user:update',
  'user:delete',
  'device:read',
  'device:create',
  'device:update',
  'device:delete',
  'model:read',
  'model:create',
  'model:update',
  'model:delete',
  'connection:read',
  'connection:create',
  'connection:update',
  'connection:delete',
  'attribute:read',
  'attribute:create',
  'attribute:update',
  'attribute:delete',
  'floor:read',
  'floor:create',
  'floor:update',
  'floor:delete',
  'log:read',
  'log:create',
  'admin:full',
]
```

**Pros**:

- ✅ Proper permission-based authorization
- ✅ Consistent format across API and UI
- ✅ Granular permission control

**Cons**:

- ⚠️ Requires API changes
- ⚠️ Requires database migration
- ⚠️ Requires redeployment of both API and UI
- ⚠️ More time consuming (30+ minutes)

### Option 3: Permission Mapper (MIDDLE GROUND)

**Add permission mapper** in UI to translate old → new format:

```typescript
/**
 * Map old API permission format to new UI format
 */
private mapPermissions(apiPermissions: string[]): string[] {
  const permissionMap: Record<string, string[]> = {
    'admin:access': [
      'user:read', 'user:create', 'user:update', 'user:delete',
      'device:read', 'device:create', 'device:update', 'device:delete',
      // ... all permissions
    ],
    'write:devices': ['device:create', 'device:update'],
    'delete:devices': ['device:delete'],
    'read:devices': ['device:read'],
    // ... etc
  };

  const mapped = new Set<string>();
  apiPermissions.forEach(perm => {
    const newPerms = permissionMap[perm];
    if (newPerms) {
      newPerms.forEach(p => mapped.add(p));
    } else {
      mapped.add(perm); // Keep unmapped permissions
    }
  });

  return Array.from(mapped);
}
```

**Pros**:

- ✅ Backward compatible with old API
- ✅ No API changes needed
- ✅ Centralized mapping logic

**Cons**:

- ⚠️ Additional mapping overhead
- ⚠️ Need to maintain mapping dictionary
- ⚠️ Still technical debt

## Recommended Implementation

**OPTION 1 - Admin Role Bypass** for immediate fix, then **OPTION 2 - API Permission Update** for proper long-term solution.

### Phase 1: Immediate Fix (5 minutes)

```bash
cd /home/karol/GitHub/3d-inventory-ui
```

Edit `src/app/services/authentication.service.ts`:

```typescript
// Around line 138-141
/**
 * Check if user has specific permission
 * Admin role automatically has all permissions
 */
hasPermission(permission: string): boolean {
  const user = this.getCurrentUser();

  // Admin role has all permissions
  if (user?.role === 'admin') {
    return true;
  }

  return user?.permissions?.includes(permission) || false;
}

/**
 * Check if user has any of the specified permissions
 * Admin role automatically has all permissions
 */
hasAnyPermission(permissions: string[]): boolean {
  const user = this.getCurrentUser();

  // Admin role has all permissions
  if (user?.role === 'admin') {
    return true;
  }

  return permissions.some(permission => this.hasPermission(permission));
}
```

Deploy:

```bash
npm run build:prod
./build.sh
./deploy.sh
```

Test:

1. Clear browser cache
2. Login as admin
3. Navigate to `/admin/users`
4. ✅ Edit/Delete buttons should now be enabled
5. ✅ Can edit user profiles and permissions

### Phase 2: Proper API Fix (Future)

**Scope**:

- Update API UserService to use new permission format
- Create database migration script
- Update all users with new permissions
- Test thoroughly
- Deploy API
- Verify UI works with new permissions
- Remove admin role bypass from UI

**Estimated Time**: 1-2 hours

## Testing Checklist

### After Quick Fix

- [ ] Admin can view user list
- [ ] Admin can see Edit button on user rows
- [ ] Admin can see Delete button on user rows
- [ ] Admin can click Edit → form opens
- [ ] Admin can modify user role
- [ ] Admin can modify user permissions
- [ ] Admin can save changes successfully
- [ ] Admin can create new users
- [ ] Admin can delete users
- [ ] Non-admin users DON'T see admin functions

### After API Fix

- [ ] All above tests pass
- [ ] Admin has explicit permissions in JWT
- [ ] hasPermission checks work correctly
- [ ] Role-based fallback can be removed
- [ ] Other roles (viewer, editor) work correctly

## Files to Modify

### Quick Fix (Option 1)

1. `/home/karol/GitHub/3d-inventory-ui/src/app/services/authentication.service.ts`
   - Modify `hasPermission()` method
   - Modify `hasAnyPermission()` method

### API Fix (Option 2)

1. `/home/karol/GitHub/3d-inventory-api/src/services/UserService.ts`
   - Update default admin permissions
2. `/home/karol/GitHub/3d-inventory-api/src/migrations/` (new)
   - Create migration script for permissions
3. Database
   - Update all users with new permission format

## Documentation

**Related Issues**:

- CSRF cookie fix (resolved)
- Production admin access (deployed)
- User management forms (already exist)
- Menu navigation (already exists)
- **Permission format mismatch** ← THIS ISSUE

**Session Timeline**:

1. Oct 12 - CSRF fix deployed
2. Oct 12 - Production deployment successful
3. Oct 12 - User requests admin can't edit users
4. Oct 12 - **Identified permission format mismatch**
5. Oct 12 - **Implementing quick fix**

---

**Status**: 🔧 Ready to Fix
**Priority**: 🔴 HIGH (blocks admin user management)
**Complexity**: 🟢 LOW (quick fix) / 🟡 MEDIUM (proper fix)
**Impact**: Critical - Admin functionality completely broken
