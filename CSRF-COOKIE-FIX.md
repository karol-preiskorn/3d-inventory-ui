# CSRF Cookie SameSite Fix

## Problem

Browser console error:

```
Cookie "csrftoken" has been rejected because it is in a cross-site context
and its "SameSite" is "Lax" or "Strict".
```

## Root Cause

Multiple Angular services have `withCredentials: true` in their HTTP options:

```typescript
httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true, // ← THIS CAUSES THE ISSUE
}
```

This setting tells the browser to send cookies with cross-origin requests (localhost:4200 → localhost:8080), which triggers SameSite cookie restrictions.

## Why This is Unnecessary

**Our app uses Bearer Token authentication**, NOT cookie-based authentication:

- Login returns JWT token in response body
- Token stored in localStorage
- Token sent in `Authorization: Bearer <token>` header
- No cookies are needed for authentication

## Solution

Remove `withCredentials: true` from all Angular services since we don't use cookie-based authentication.

## Files to Fix

The following services have unnecessary `withCredentials: true`:

1. ✅ **connection.service.ts** - Line 28
2. ✅ **models.service.ts** - Line 37
3. ✅ **attribute-dictionary.service.ts** - Line 25
4. ✅ **device.service.ts** - Line 39
5. ✅ **log.service.ts** - Line 84
6. ✅ **floor.service.ts** - Line 27
7. ✅ **attribute.service.ts** - Line 29

## Implementation

### Before (Incorrect):

```typescript
httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true, // Causes CSRF cookie errors
}
```

### After (Correct):

```typescript
httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  // withCredentials removed - we use Bearer tokens, not cookies
}
```

## Verification

After fixing, verify:

1. ✅ No more "Cookie csrftoken rejected" errors in browser console
2. ✅ API requests still work (Bearer token in Authorization header)
3. ✅ Login/logout functionality works
4. ✅ Admin access works (user.role correctly extracted from JWT)

## Testing Steps

1. **Clear browser storage**:

   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

2. **Start servers**:

   ```bash
   # Terminal 1 - API
   cd /home/karol/GitHub/3d-inventory-api
   npm run dev

   # Terminal 2 - UI
   cd /home/karol/GitHub/3d-inventory-ui
   npm start
   ```

3. **Test login flow**:
   - Navigate to http://localhost:4200/login
   - Login with: admin / admin123!
   - Check browser console - NO cookie errors
   - Navigate to http://localhost:4200/admin/users
   - Should work without errors

4. **Verify network requests**:
   - Open DevTools Network tab
   - Look for API requests (e.g., /connections, /devices)
   - Request Headers should show: `Authorization: Bearer <token>`
   - Response Headers should show CORS headers
   - NO cookie-related errors

## Alternative Solution (If Cookies Were Needed)

If the app DID use cookies for authentication, the API would need to set cookies with:

```typescript
res.cookie('csrftoken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'none', // Required for cross-origin
  maxAge: 3600000,
})
```

But since we use Bearer tokens, this is **NOT needed**.

## Summary

- ✅ **Root Cause**: `withCredentials: true` in Angular services
- ✅ **Solution**: Remove `withCredentials: true` (we use Bearer tokens)
- ✅ **Impact**: Eliminates CSRF cookie SameSite errors
- ✅ **Testing**: Clear browser storage, restart servers, verify no errors
- ✅ **Authentication**: Still works via Bearer token in Authorization header

## References

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Angular HttpClient credentials](https://angular.io/api/common/http/HttpClient)
- [JWT Bearer Token Authentication](https://jwt.io/introduction)
