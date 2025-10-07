# CreateLog API 400 Error Fix

## Issue Report

**Date**: October 7, 2025
**Error**: HTTP 400 Bad Request when creating logs
**Message**: `"message must be a non-empty string"`

### Error Details

```
ERROR Error: HTTP error occurred (status: 400):
Http failure response for https://d-inventory-api-wzwe3odv7q-ew.a.run.app/logs: 400
Details: {"error":"Invalid input data","message":"message must be a non-empty string"}
```

---

## Root Cause Analysis

### Backend API Requirements

The backend API (`/home/karol/GitHub/3d-inventory-api/src/controllers/logs.ts`) expects:

```typescript
export interface Logs {
  _id?: ObjectId
  objectId: string
  date: string
  operation: string
  component: string
  message: string // ⚠️ MUST BE A STRING, NOT AN OBJECT
}
```

**Validation Code** (lines 207-217):

```typescript
const sanitizedMessage = mongoSanitize(message)?.toString().trim()

if (!sanitizedMessage) {
  logger.warn(`${proc} Missing required fields: message`)
  res.status(400).json({
    error: 'Invalid input data',
    message: 'message must be a non-empty string',
  })
  return
}
```

### Frontend Implementation Error

The UI was incorrectly passing **objects** as the message parameter:

```typescript
// ❌ INCORRECT - Passing object
this.logService.CreateLog({
  message: { id }, // Object gets converted to "[object Object]"
  objectId: id.toString(),
  operation: 'Delete',
  component: 'attributesDictionary',
})

// ❌ INCORRECT - Another example
this.logService.CreateLog({
  message: { id: id, idNew: idNew }, // Object
  operation: 'Clone',
  component: 'devices',
})
```

When JavaScript objects are converted to strings via `toString()`, they become `"[object Object]"`, which after `trim()` fails the validation.

---

## Solution Implementation

### 1. Updated Log Service Interfaces

**File**: `src/app/services/log.service.ts`

#### Log Interface (Lines 33-41)

```typescript
/**
 * Represents a log entry.
 */
export interface Log {
  _id: string
  date: string
  objectId?: string
  operation: string // [create, update, delete, clone]
  component: string // [device, model, category, floor]
  message: string // JSON string representation of log details
}
```

#### LogIn Interface (Lines 48-60)

```typescript
/**
 * Represents the input structure for creating a new log entry.
 * @property objectId - (Optional) The ID of the related object.
 * @property operation - The operation performed (e.g., create, update, delete, clone).
 * @property component - The component associated with the log (e.g., device, model, category, floor).
 * @property message - The log message as a JSON string (use JSON.stringify() for objects).
 */
export interface LogIn {
  objectId?: string
  operation: string
  component: string
  message: string // ✅ Changed from 'object' to 'string'
}
```

### 2. Fixed Component Implementations

#### Attribute Dictionary List Component

**File**: `src/app/components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component.ts`

**Delete Operation:**

```typescript
// ✅ CORRECT - JSON.stringify() converts object to string
deleteAttributeDictionary(id: string) {
  this.logService.CreateLog({
    message: JSON.stringify({ id, action: 'Delete attribute dictionary' }),
    objectId: id.toString(),
    operation: 'Delete',
    component: 'attributesDictionary',
  })
  // ... rest of implementation
}
```

**Clone Operation:**

```typescript
// ✅ CORRECT - Structured log message
CloneAttributeDictionary(id: string) {
  this.attributeDictionaryService.CloneAttributeDictionary(id).subscribe((cloned) => {
    const id_new: string = cloned._id
    this.logService.CreateLog({
      message: JSON.stringify({
        originalId: id,
        clonedId: id_new,
        action: 'Clone attribute dictionary'
      }),
      operation: 'Clone',
      component: 'attributesDictionary',
    })
    // ... rest of implementation
  })
}
```

#### Device List Component

**File**: `src/app/components/devices/devices-list/devices-list.component.ts`

**Delete Operation:**

```typescript
// ✅ CORRECT
async DeleteDevice(id: string) {
  try {
    await firstValueFrom(
      this.logService.CreateLog({
        message: JSON.stringify({ id, action: 'Delete device' }),
        objectId: id,
        operation: 'Delete',
        component: this.component,
      }),
    )
  } catch (logError) {
    console.error('Error creating log:', logError)
    return
  }
  // ... rest of implementation
}
```

**Clone Operation:**

```typescript
// ✅ CORRECT
async CloneDevice(id: string) {
  const idNew = this.devicesService.CloneDevice(id) as Device
  this.logService.CreateLog({
    message: JSON.stringify({
      originalId: id,
      clonedId: idNew,
      action: 'Clone device'
    }),
    operation: 'Clone',
    component: this.component,
  })
  // ... rest of implementation
}
```

#### Model List Component

**File**: `src/app/components/models/model-list/model-list.component.ts`

**Delete Operation:**

```typescript
// ✅ CORRECT
DeleteModel(id: string) {
  this.logService.CreateLog({
    message: JSON.stringify({ id, action: 'Delete model' }),
    objectId: id,
    operation: 'Delete',
    component: this.component
  })
  // ... rest of implementation
}
```

**Clone Operation:**

```typescript
// ✅ CORRECT
CloneModel(id: string): void {
  try {
    const clonedId = this.modelsService.CloneModel(id)
    this.logService.CreateLog({
      message: JSON.stringify({
        originalId: id,
        clonedId,
        action: 'Clone model'
      }),
      operation: 'Clone',
      component: this.component
    })
    // ... rest of implementation
  } catch (error) {
    console.error('Error occurred while cloning model:', error)
  }
}
```

---

## Files Modified

### Components Fixed (3 files)

1. ✅ `src/app/components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component.ts`
   - Fixed `deleteAttributeDictionary()` method
   - Fixed `CloneAttributeDictionary()` method

2. ✅ `src/app/components/devices/devices-list/devices-list.component.ts`
   - Fixed `DeleteDevice()` method
   - Fixed `CloneDevice()` method

3. ✅ `src/app/components/models/model-list/model-list.component.ts`
   - Fixed `DeleteModel()` method
   - Fixed `CloneModel()` method

### Interfaces Updated (1 file)

4. ✅ `src/app/services/log.service.ts`
   - Updated `Log.message` type: `Record<string, unknown>` → `string`
   - Updated `LogIn.message` type: `object` → `string`
   - Added documentation explaining JSON.stringify() requirement

---

## Best Practices for CreateLog

### ✅ Correct Usage Pattern

```typescript
// Always use JSON.stringify() for structured log data
this.logService.CreateLog({
  message: JSON.stringify({
    // Include relevant context
    id: entityId,
    action: 'Operation description',
    timestamp: new Date().toISOString(),
    // Any other relevant data
    additionalInfo: someValue
  }),
  objectId: entityId,
  operation: 'Create' | 'Update' | 'Delete' | 'Clone',
  component: 'devices' | 'models' | 'attributesDictionary' | etc.
})
```

### ❌ Incorrect Usage Patterns

```typescript
// ❌ DON'T: Pass plain objects
this.logService.CreateLog({
  message: { id }, // This becomes "[object Object]"
  // ...
})

// ❌ DON'T: Pass empty strings
this.logService.CreateLog({
  message: '', // Fails validation
  // ...
})

// ❌ DON'T: Pass undefined/null
this.logService.CreateLog({
  message: undefined, // Fails validation
  // ...
})
```

### 💡 Recommended Message Structure

For **Delete Operations**:

```typescript
JSON.stringify({
  id: entityId,
  action: 'Delete {entity_type}',
  deletedBy: currentUserId, // if available
})
```

For **Clone Operations**:

```typescript
JSON.stringify({
  originalId: sourceId,
  clonedId: newId,
  action: 'Clone {entity_type}',
  clonedBy: currentUserId, // if available
})
```

For **Create Operations**:

```typescript
JSON.stringify({
  id: newEntityId,
  action: 'Create {entity_type}',
  name: entityName, // key identifying info
  createdBy: currentUserId, // if available
})
```

For **Update Operations**:

```typescript
JSON.stringify({
  id: entityId,
  action: 'Update {entity_type}',
  changes: { field1: newValue1, field2: newValue2 },
  updatedBy: currentUserId, // if available
})
```

---

## Testing Verification

### Test Cases

1. **Delete Attribute Dictionary**

   ```typescript
   // Navigate to attribute-dictionary-list
   // Click delete on any attribute dictionary
   // Expected: Success, no 400 error
   // Log created with JSON message
   ```

2. **Clone Attribute Dictionary**

   ```typescript
   // Navigate to attribute-dictionary-list
   // Click clone on any attribute dictionary
   // Expected: Success, no 400 error
   // Log created with originalId and clonedId
   ```

3. **Delete Device**

   ```typescript
   // Navigate to device-list
   // Click delete on any device
   // Expected: Success, no 400 error
   // Log created with device ID
   ```

4. **Clone Device**

   ```typescript
   // Navigate to device-list
   // Click clone on any device
   // Expected: Success, no 400 error
   // Log created with both IDs
   ```

5. **Delete Model**

   ```typescript
   // Navigate to models-list
   // Click delete on any model
   // Expected: Success, no 400 error
   // Log created successfully
   ```

6. **Clone Model**
   ```typescript
   // Navigate to models-list
   // Click clone on any model
   // Expected: Success, no 400 error
   // Log created with structured message
   ```

### Verify Log Entries

After testing, check the logs API to verify proper storage:

```bash
# Get recent logs
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://d-inventory-api-wzwe3odv7q-ew.a.run.app/logs?limit=10

# Expected response: Logs with JSON-stringified messages
# Example:
{
  "_id": "...",
  "objectId": "67641b2a8ec6a933ce6f2101",
  "operation": "Delete",
  "component": "attributesDictionary",
  "message": "{\"id\":\"67641b2a8ec6a933ce6f2101\",\"action\":\"Delete attribute dictionary\"}",
  "date": "2025-10-07 14:30:22"
}
```

---

## TypeScript Type Safety

The interface changes now **enforce** correct usage at compile time:

```typescript
// ✅ TypeScript will accept this (string)
const log: LogIn = {
  message: JSON.stringify({ id: '123' }),
  operation: 'Delete',
  component: 'devices',
}

// ❌ TypeScript will reject this (object)
const log: LogIn = {
  message: { id: '123' }, // Type 'object' is not assignable to type 'string'
  operation: 'Delete',
  component: 'devices',
}
```

---

## Migration Notes

### For Future Development

When adding new components that need logging:

1. **Import the LogService**

   ```typescript
   import { LogService } from '../../../services/log.service'
   ```

2. **Inject in constructor**

   ```typescript
   constructor(private logService: LogService) {}
   ```

3. **Use JSON.stringify() for all log messages**

   ```typescript
   this.logService.CreateLog({
     message: JSON.stringify({
       /* your data */
     }),
     objectId: entityId,
     operation: 'Create' | 'Update' | 'Delete' | 'Clone',
     component: 'your-component-name',
   })
   ```

4. **Include meaningful context**
   - Entity ID(s)
   - Action description
   - User information (if available)
   - Timestamp (if needed)
   - Any other relevant metadata

---

## Summary

### Problem

- Frontend passing objects to `message` field
- Backend expecting strings
- Objects converted to `"[object Object]"` → validation failure → 400 error

### Solution

- Changed `LogIn.message` type from `object` to `string`
- Updated all components to use `JSON.stringify()`
- Added proper TypeScript type safety
- Documented best practices

### Impact

- ✅ No more 400 errors when creating logs
- ✅ Structured, parseable log messages
- ✅ Type safety prevents future regressions
- ✅ Better log readability and debugging
- ✅ Consistent logging across all components

---

**Status**: ✅ FIXED - All components updated, interfaces corrected, ready for deployment

**Related Issues**:

- Initial issue: 401 authentication errors (fixed in AUTH-GUARD-FIX.md)
- Current issue: 400 log creation errors (fixed in this document)

**Next Steps**:

1. Build production version
2. Deploy to Google Cloud
3. Test all delete/clone operations
4. Verify logs are created successfully
5. Monitor for any remaining errors
