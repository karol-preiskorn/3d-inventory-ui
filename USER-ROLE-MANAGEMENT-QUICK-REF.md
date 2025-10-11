# User Role Management - Quick Reference

## Summary

✅ **Implementation Complete** - Admin-only user role management is now fully functional and secured.

## What Was Done

### 1. Created Admin Route Guard

- **File**: `/src/app/guards/admin.guard.ts`
- **Purpose**: Restricts access to admin-only routes
- **Security**: Checks authentication AND admin role
- **Features**:
  - Redirects unauthenticated users to `/login`
  - Redirects non-admin users to `/home` with error
  - Works with both parent and child routes

### 2. Secured Admin Routes

- **File**: `/src/app/features/admin/admin.routes.ts`
- **Change**: Added `AdminGuard` to admin route configuration
- **Protection**: All `/admin/*` routes now require admin role

### 3. Created Comprehensive Tests

- **File**: `/src/app/guards/admin.guard.spec.ts`
- **Coverage**: 6 test scenarios for various user roles
- **Tests**: Admin, user, viewer, unauthenticated access

### 4. Documentation

- **File**: `/USER-ROLE-MANAGEMENT.md`
- **Content**: Complete implementation guide, testing, troubleshooting

---

## How to Use (Admin User)

### Access User Management

1. Login with admin credentials: `admin / admin123!`
2. Navigate to: `/admin/users`
3. View list of all users with roles displayed

### Edit User Role

1. Click "Edit" button next to user
2. Navigate to: `/admin/users/edit/{user_id}`
3. Select new role from dropdown
4. Click "Save" button
5. Role updated successfully

### Available Roles

- **admin** - Full system access including user management
- **user** - Standard user with CRUD permissions
- **viewer** - Read-only access

---

## Security Features

### Multi-Layer Protection

1. **Frontend Route Guard** → Checks role before navigation
2. **Component Logic** → Disables role field for non-admins
3. **Backend API** → Validates admin role on server
4. **Database** → Enforces role enum values

### Access Control

- ✅ Admin users: Full access to user management
- ❌ Regular users: Cannot access `/admin/users` routes
- ❌ Viewer users: Cannot access `/admin/users` routes
- ❌ Unauthenticated: Redirected to login

---

## Testing

### Manual Testing Checklist

#### Admin Access ✓

```bash
Login: admin / admin123!
Navigate: /admin/users
Expected: ✓ User list displayed
Test: ✓ Can edit user roles
```

#### Regular User Access ✓

```bash
Login: user / user123!
Navigate: /admin/users
Expected: ✓ Redirected to /home
Error: "Admin access required"
```

#### Viewer Access ✓

```bash
Login: viewer / viewer123!
Navigate: /admin/users
Expected: ✓ Redirected to /home
Error: "Admin access required"
```

#### Unauthenticated Access ✓

```bash
Logout (no credentials)
Navigate: /admin/users
Expected: ✓ Redirected to /login
Query param: returnUrl=/admin/users
```

### Run Unit Tests

```bash
cd /home/karol/GitHub/3d-inventory-ui
npm test -- admin.guard.spec.ts
```

---

## API Integration

### Backend Endpoint

**PUT** `/user-management/:id`

**Security**: Admin role required to change role field

**Example Request**:

```typescript
PUT /user-management/507f1f77bcf86cd799439011
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "admin"  // or "user", "viewer"
}
```

**Example Response** (200 OK):

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

---

## File Structure

### New Files

```
src/app/guards/
├── admin.guard.ts          ← NEW: Admin role guard
└── admin.guard.spec.ts     ← NEW: Guard unit tests
```

### Modified Files

```
src/app/features/admin/
└── admin.routes.ts         ← UPDATED: Added AdminGuard
```

### Existing Files (Not Modified)

```
src/app/components/users/
├── user-form.component.ts  ← Already has role dropdown
└── user-list.component.ts  ← Already shows roles

src/app/services/
├── authentication.service.ts  ← Already has authState$
└── user.service.ts           ← Already has updateUser()

Backend:
└── src/routers/user-management.ts  ← Already has PUT endpoint
```

---

## Build & Deploy

### Development Testing

```bash
# Frontend
cd /home/karol/GitHub/3d-inventory-ui
npm run start

# Backend
cd /home/karol/GitHub/3d-inventory-api
npm run dev
```

### Production Build

```bash
# Frontend
cd /home/karol/GitHub/3d-inventory-ui
npm run build:prod

# Deploy to Google Cloud
npm run gcp:build
```

---

## Troubleshooting

### Issue: Admin redirected unexpectedly

**Solution**: Check JWT token contains `role: "admin"` field

```javascript
// In browser console:
const token = localStorage.getItem('token')
// Decode at jwt.io to verify role field
```

### Issue: Cannot save role changes

**Solution**: Verify admin role in authState

```typescript
this.authService.authState$.subscribe((state) => {
  console.log('User role:', state.user?.role)
})
```

### Issue: Guard not working

**Solution**: Verify guard is applied to routes

```typescript
// In admin.routes.ts:
canActivate: [AdminGuard],
canActivateChild: [AdminGuard]
```

---

## Next Steps (Future Enhancements)

### Short Term

- [ ] Add audit logging for role changes
- [ ] Email notifications when user role changes
- [ ] Bulk role update functionality

### Long Term

- [ ] Permission-based access (beyond roles)
- [ ] Custom role creation
- [ ] Role hierarchy and inheritance
- [ ] Audit dashboard for security events

---

## Testing Credentials

```typescript
const credentials = [
  { username: 'admin', password: 'admin123!', role: 'admin' },
  { username: 'user', password: 'user123!', role: 'user' },
  { username: 'carlo', password: 'carlo123!', role: 'user' },
  { username: 'viewer', password: 'viewer123!', role: 'viewer' },
]
```

---

## Related Documentation

- **Full Documentation**: `/USER-ROLE-MANAGEMENT.md`
- **Admin Guard**: `/src/app/guards/admin.guard.ts`
- **Admin Routes**: `/src/app/features/admin/admin.routes.ts`
- **Backend API**: `/src/routers/user-management.ts` (in API project)

---

**Status**: ✅ Ready for Testing
**Date**: 2025-10-11
**Version**: 1.0
