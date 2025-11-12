# User Profile Form Debug Guide

## Issue

The user profile form at https://3d-inventory.ultimasolution.pl/admin/profile is not displaying data from the database.

## Version Deployed

- **Version**: v0.59.79
- **Revision**: d-inventory-ui-00068-vwp
- **Deployment Time**: 2025-01-09 20:08

## Debug Logging Added

I've added comprehensive console.warn() and console.error() logging to track the data flow when the profile loads. The debug messages use emojis for easy identification:

### Debug Messages to Look For

1. **🔍 Initial User Check**

   ```
   🔍 [Profile Debug] Current user from auth: <user object>
   🔍 [Profile Debug] User ID: <user._id>
   ```

   - This shows what user data is in the authentication service
   - Check if `_id` property exists and has a value

2. **❌ User Not Found Error**

   ```
   ❌ [Profile Debug] User not found or missing _id
   ```

   - This means the user object doesn't have an `_id` property
   - Problem: Authentication service isn't providing complete user data

3. **📡 API Call Initiated**

   ```
   📡 [Profile Debug] Calling getUserById with ID: <user._id>
   ```

   - Confirms the API call is being made with the user ID

4. **✅ Successful API Response**

   ```
   ✅ [Profile Debug] User data received from API: <userData object>
   ```

   - Shows the complete user data returned from the API
   - Check if `username`, `email`, and other fields exist

5. **📝 Form Population**

   ```
   📝 [Profile Debug] Populating form with user: <user object>
   📝 [Profile Debug] Username: <username>
   📝 [Profile Debug] Email: <email>
   📝 [Profile Debug] Form controls after patch: {username: '...', email: '...'}
   ```

   - Shows the data being used to populate the form
   - Confirms form controls were updated

6. **📝 Form After Population**

   ```
   📝 [Profile Debug] Form value after population: <form values>
   ```

   - Final form state after data is loaded

7. **❌ API Error**
   ```
   ❌ [Profile Debug] Error loading user profile: <error>
   ```

   - Shows any errors that occurred during API call

## How to Debug

### Step 1: Open Browser Console

1. Navigate to https://3d-inventory.ultimasolution.pl/admin/profile
2. Open Developer Tools (F12)
3. Go to the **Console** tab
4. Look for debug messages with the emojis above

### Step 2: Check Network Tab

1. Go to the **Network** tab in DevTools
2. Filter by "Fetch/XHR"
3. Look for a request to `/users/<id>`
4. Check:
   - **Status Code**: Should be 200 OK
   - **Request Headers**: Should include Authorization token
   - **Response**: Should contain user data with `_id`, `username`, `email`, `permissions`, etc.

### Step 3: Analyze the Data Flow

#### Scenario A: No API Call Made

If you see:

```
❌ [Profile Debug] User not found or missing _id
```

**Problem**: The authentication service doesn't have user.\_id
**Solution**:

- Check localStorage for the JWT token
- Decode the JWT to see what user data it contains
- The token may not include the `_id` field

**Fix Required**: Update AuthenticationService to properly extract `_id` from the JWT token

#### Scenario B: API Call Fails

If you see the API call being made but getting an error:

```
📡 [Profile Debug] Calling getUserById with ID: xxx
❌ [Profile Debug] Error loading user profile: <error>
```

**Problem**: API endpoint error (401, 404, 500)
**Check**:

- Network tab for exact error status
- Is the JWT token valid?
- Does the user ID exist in the database?
- Is the backend API running?

#### Scenario C: API Returns Wrong Data

If you see:

```
✅ [Profile Debug] User data received from API: { ... }
```

But the form is still empty:

**Problem**: Data structure mismatch
**Check**:

- Does the returned object have `username` or `name` field?
- Does it have `email` field?
- Compare the API response structure to the User interface

#### Scenario D: Form Doesn't Update

If you see all debug messages successfully but the form is still empty:

**Problem**: Angular change detection or template binding issue
**Check**:

- Look at the last debug message showing form values
- If values are there but not displaying, it's a template issue
- Check the HTML template bindings

## Expected Successful Flow

When working correctly, you should see this sequence:

```
1. 🔍 [Profile Debug] Current user from auth: {_id: "xxx", username: "carlo", ...}
2. 🔍 [Profile Debug] User ID: xxx
3. 📡 [Profile Debug] Calling getUserById with ID: xxx
4. ✅ [Profile Debug] User data received from API: {_id: "xxx", username: "carlo", email: "carlo@example.com", ...}
5. 📝 [Profile Debug] Populating form with user: {_id: "xxx", username: "carlo", ...}
6. 📝 [Profile Debug] Username: carlo
7. 📝 [Profile Debug] Email: carlo@example.com
8. 📝 [Profile Debug] Form controls after patch: {username: "carlo", email: "carlo@example.com"}
9. 📝 [Profile Debug] Form value after population: {username: "carlo", email: "carlo@example.com", currentPassword: ""}
```

Then the form should display with:

- Username field: "carlo" (read-only)
- Email field: "carlo@example.com" (editable)
- Current Password field: empty (for confirmation when saving)

## Common Issues and Fixes

### Issue 1: JWT Token Missing \_id

**Symptom**: `❌ User not found or missing _id`
**Cause**: JWT token doesn't include the `_id` field
**Fix**: Update backend to include `_id` in JWT payload, or update frontend to extract it differently

### Issue 2: CORS Error

**Symptom**: Network error, no response in console
**Cause**: Backend not allowing requests from frontend domain
**Fix**: Update backend CORS configuration

### Issue 3: 401 Unauthorized

**Symptom**: API call returns 401
**Cause**: JWT token expired or invalid
**Fix**: Re-login to get fresh token

### Issue 4: 404 Not Found

**Symptom**: API call returns 404
**Cause**: User ID doesn't exist in database or API endpoint wrong
**Fix**: Check user ID and verify API endpoint URL

### Issue 5: Data Structure Mismatch

**Symptom**: API returns data but form empty
**Cause**: User object has different field names (e.g., `name` instead of `username`)
**Fix**: Update populateForm() to handle both field name variations

## Next Steps

1. **Test in Production**: Visit https://3d-inventory.ultimasolution.pl/admin/profile
2. **Check Console**: Look for the debug messages
3. **Report Findings**: Share the console output to identify the exact issue
4. **Apply Fix**: Based on the findings, implement the appropriate fix
5. **Remove Debug Logging**: Once fixed, remove console.warn() calls (keep only console.error())

## Files Modified

- `src/app/components/users/user-profile.component.ts`: Added debug logging to loadCurrentUser() and populateForm()

## Contact

If you see any unexpected behavior or need help interpreting the debug messages, please share:

1. Full console output (including all debug messages)
2. Network tab screenshot showing the `/users/<id>` request
3. Any error messages displayed in the UI
