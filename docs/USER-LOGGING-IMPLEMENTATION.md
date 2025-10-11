# User Information in Logging - Implementation Summary

## Overview

Enhanced the logging system to automatically capture user information (userId and username) for all log entries across the 3D Inventory application.

## Changes Made

### 1. UI Changes (3d-inventory-ui)

#### A. Log Service Interface Update

**File**: `src/app/services/log.service.ts`

**LogIn Interface Enhancement**:

```typescript
export interface LogIn {
  objectId?: string
  operation: string
  component: string
  message: string
  userId?: string // ← NEW: User ID who performed the action
  username?: string // ← NEW: Username who performed the action
}
```

#### B. Log Service Implementation

**File**: `src/app/services/log.service.ts`

**Automatic User Information Injection**:

```typescript
constructor(
  private http: HttpClient,
  private debugService: DebugService,
  private authService: AuthenticationService  // ← NEW: Inject auth service
) { }

CreateLog(data: LogIn): Observable<Log> {
  // Automatically add user information if not provided
  const currentUser = this.authService.getCurrentUser();
  const enrichedData: LogIn = {
    ...data,
    userId: data.userId || currentUser?._id,
    username: data.username || currentUser?.username
  };

  this.debugService.debug('LogService.CreateLog: ' + JSON.stringify(enrichedData, null, 2));
  return this.http.post<Log>(this.getLogsUrl(), enrichedData, this.httpOptions)
    .pipe(retry(1), catchError(this.handleError))
}
```

**Benefits**:

- ✅ **Automatic**: No need to modify existing CreateLog() calls
- ✅ **Consistent**: All logs automatically include user context
- ✅ **Flexible**: Can override by explicitly providing userId/username
- ✅ **Backward Compatible**: Works with existing code

### 2. API Changes (3d-inventory-api)

#### A. Log Service Interface Update

**File**: `src/services/logs.ts`

**Enhanced Log Interfaces**:

```typescript
export interface Log {
  _id: ObjectId
  date: string
  objectId?: string
  operation: string
  component: string
  message: object
  userId?: string // ← NEW: User ID who performed the action
  username?: string // ← NEW: Username who performed the action
}

export interface LogCreate {
  objectId?: string
  operation: string
  component: string
  date: string
  message: object
  userId?: string // ← NEW
  username?: string // ← NEW
}
```

**Updated CreateLog Function**:

```typescript
export async function CreateLog(
  objectId: string,
  message: object,
  operation: string,
  component: string,
  userId?: string, // ← NEW parameter
  username?: string, // ← NEW parameter
): Promise<Observable<InsertOneResult<Document>>> {
  const log: LogCreate = {
    date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    message: message,
    operation: operation,
    component: component,
    objectId: objectId,
    userId: userId, // ← Store user ID
    username: username, // ← Store username
  }

  console.log('LogCreate: ' + JSON.stringify(log, null, ' '))
  const result: InsertOneResult<Document> = await collection.insertOne(log)
  return of(result)
}
```

#### B. Logs Controller Update

**File**: `src/controllers/logs.ts`

**Updated Logs Interface**:

```typescript
export interface Logs {
  _id?: ObjectId
  objectId: string
  date: string
  operation: string
  component: string
  message: string
  userId?: string // ← NEW
  username?: string // ← NEW
}
```

**Enhanced createLog Controller**:

```typescript
export const createLog: RequestHandler = async (req, res) => {
  const { objectId, operation, component, message, userId, username } = req.body

  // Sanitize new fields
  const sanitizedUserId = userId ? mongoSanitize(userId)?.toString().trim() : undefined
  const sanitizedUsername = username ? mongoSanitize(username)?.toString().trim() : undefined

  const newDocument: Logs = {
    objectId: sanitizedObjectId,
    operation: sanitizedOperation,
    component: sanitizedComponent,
    message: sanitizedMessage,
    date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    userId: sanitizedUserId, // ← Store user ID
    username: sanitizedUsername, // ← Store username
  }

  // Enhanced logging
  logger.info(`${proc} Log created with ID: ${result.insertedId} by user: ${sanitizedUsername || 'unknown'}`)
  res.status(201).json(insertedLog)
}
```

### 3. Data Model Verification

#### UI User Model (`src/app/shared/user.ts`)

```typescript
export interface User {
  _id: string
  username: string
  name?: string // Optional alias
  email: string
  password?: string
  token?: string
  permissions: string[]
  role?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  lastLogin?: Date
}
```

#### API User Model (`src/models/User.ts`)

```typescript
export interface User {
  _id?: ObjectId
  username: string
  email: string
  password: string
  role: UserRole
  permissions?: Permission[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  loginAttempts?: number
  lockUntil?: Date
}
```

**Consistency Check**: ✅ PASS

- Both models have `_id`, `username`, `email`, `role`, `permissions`
- UI model includes optional `token` for JWT storage
- API model includes security fields (`loginAttempts`, `lockUntil`)
- Models are compatible for logging purposes

## Database Schema

### Logs Collection

```javascript
{
  "_id": ObjectId,
  "date": "2025-10-09 20:45:30",     // ISO datetime string
  "objectId": "deviceId123",          // ID of related object
  "operation": "Create",              // Create, Update, Delete, Clone
  "component": "devices",             // devices, models, connections, etc.
  "message": "{...}",                 // JSON string with details
  "userId": "68e03e971b67a4c671813bda",    // ← NEW: User ID
  "username": "admin"                       // ← NEW: Username
}
```

## Existing CreateLog Calls

**Location**: All components already call `logService.CreateLog()`

**Components with CreateLog**:

- ✅ Connection components (add, edit, list)
- ✅ Device components (edit)
- ✅ Floor components (add, edit, list)
- ✅ Model components (edit)
- ✅ Attribute components (add, list)
- ✅ Attribute Dictionary components
- ✅ Log test component

**Example Usage** (no changes needed):

```typescript
this.logService
  .CreateLog({
    objectId: deviceId,
    operation: 'Create',
    component: 'devices',
    message: JSON.stringify({
      action: 'Device created',
      deviceName: device.name,
    }),
    // userId and username automatically added by LogService! ✅
  })
  .subscribe()
```

## Testing Plan

### 1. Unit Tests

- [ ] Test LogService.CreateLog() adds userId/username from AuthenticationService
- [ ] Test LogService.CreateLog() uses provided userId/username if specified
- [ ] Test LogService.CreateLog() handles missing authentication gracefully
- [ ] Test API createLog controller accepts and stores user fields

### 2. Integration Tests

- [ ] Login as 'admin' user
- [ ] Create a device and verify log includes userId and username='admin'
- [ ] Update a model and verify log includes user information
- [ ] Delete a connection and verify log includes user information

### 3. Database Verification

```javascript
// MongoDB query to verify user information in logs
db.logs.find({ username: { $exists: true } }).limit(10).pretty()

// Expected result:
{
  "_id": ObjectId("..."),
  "date": "2025-10-09 20:45:30",
  "objectId": "...",
  "operation": "Create",
  "component": "devices",
  "message": "{\"action\":\"Device created\",\"deviceName\":\"Server-01\"}",
  "userId": "68e03e971b67a4c671813bda",
  "username": "admin"
}
```

### 4. Different User Roles

Test logging with different authenticated users:

- [ ] Admin user (role: 'admin')
- [ ] Regular user (role: 'user')
- [ ] Carlo user (role: 'user')
- [ ] Viewer user (role: 'viewer')

Expected: Each log entry should show the correct username

## Benefits

### 1. **Audit Trail**

- Complete user accountability for all actions
- Track who created, updated, or deleted resources
- Compliance and security requirements satisfied

### 2. **Debugging**

- Identify which user encountered errors
- Reproduce issues with specific user context
- Better error reporting and support

### 3. **Analytics**

- User activity tracking
- Most active users
- Operation patterns by user role

### 4. **Security**

- Detect unauthorized access attempts
- Monitor suspicious activity
- User behavior analysis

## Migration Considerations

### Existing Logs

- Old logs without userId/username will still work
- Fields are optional, so backward compatibility maintained
- New logs will automatically include user information

### Performance Impact

- Minimal: Only adds two small string fields per log
- Automatic injection happens in-memory before HTTP call
- No additional database queries needed

## Future Enhancements

### 1. User IP Address

```typescript
export interface LogIn {
  userId?: string
  username?: string
  userIP?: string // ← Future: User IP address
  userAgent?: string // ← Future: Browser/device info
}
```

### 2. Session Tracking

```typescript
export interface LogIn {
  sessionId?: string // ← Future: Track user sessions
}
```

### 3. Detailed User Context

```typescript
export interface LogIn {
  userRole?: string // ← Future: User role at time of action
  userPermissions?: string[] // ← Future: Active permissions
}
```

## Version History

### v0.59.83 (Current)

- ✅ Added userId and username to LogIn interface (UI)
- ✅ LogService automatically injects user information
- ✅ Updated API Log and LogCreate interfaces
- ✅ Enhanced createLog controller with user fields
- ✅ All existing CreateLog calls automatically include user info

## Deployment Checklist

- [ ] Build Angular UI with updated LogService
- [ ] Build API with updated log interfaces and controller
- [ ] Deploy UI to Cloud Run
- [ ] Deploy API to Cloud Run
- [ ] Verify logs in MongoDB contain userId and username
- [ ] Test with multiple user accounts
- [ ] Monitor for any errors or issues
- [ ] Update documentation

## Files Modified

### UI (3d-inventory-ui)

1. `src/app/services/log.service.ts` - Enhanced LogIn interface and CreateLog method

### API (3d-inventory-api)

1. `src/services/logs.ts` - Updated Log and LogCreate interfaces, enhanced CreateLog function
2. `src/controllers/logs.ts` - Updated Logs interface and createLog controller

### No Changes Required

- ✅ All component files with CreateLog() calls (automatic user injection)
- ✅ User models (already compatible)
- ✅ Database schema (fields are optional)

---

**Implementation Date**: October 9, 2025
**Version**: v0.59.83
**Status**: Ready for build and deployment
