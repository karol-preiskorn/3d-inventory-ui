# "Loading user data..." - Page Stuck Issue

## Problem Reported

User sees "Loading user data..." message that never completes when accessing:

```
https://3d-inventory.ultimasolution.pl/admin/users/edit/68e03e971b67a4c671813bda
```

## Root Cause Analysis

The page is stuck in loading state, which means the `getUserById()` API call is either:

1. ❌ **Failing silently** (error not being displayed)
2. ❌ **Hanging/timing out** (never completes)
3. ❌ **Blocked by CORS or authentication**

### Code Flow

```typescript
// user-form.component.ts (line 122-139)
private loadUser(): void {
  if (!this.userId) { return; }

  this.loading = true;  // ← Sets loading state to TRUE
  this.error = null;

  this.userService.getUserById(this.userId).pipe(
    takeUntil(this.destroy$)
  ).subscribe({
    next: (user) => {
      this.currentUser = user;
      this.populateForm(user);
      this.loading = false;  // ← Should set loading to FALSE
    },
    error: (error) => {
      this.error = error.message || 'Failed to load user';
      this.loading = false;  // ← Should set loading to FALSE
      console.error('Error loading user:', error);
    }
  });
}
```

**The loading flag stays TRUE because the API call never completes (neither success nor error callback).**

---

## Immediate Debugging Steps

### Step 1: Check Browser Console for Errors

**Press F12 → Console tab**

Look for errors like:

```
❌ GET https://3d-inventory-api.ultimasolution.pl/users/68e03e971b67a4c671813bda 401 (Unauthorized)
❌ GET https://3d-inventory-api.ultimasolution.pl/users/68e03e971b67a4c671813bda 403 (Forbidden)
❌ GET https://3d-inventory-api.ultimasolution.pl/users/68e03e971b67a4c671813bda 500 (Internal Server Error)
❌ CORS policy error
❌ Failed to fetch
```

---

### Step 2: Check Network Tab

**Press F12 → Network tab**

1. **Refresh the page** while Network tab is open
2. **Look for API call**: `/users/68e03e971b67a4c671813bda`
3. **Check the response:**
   - ✅ **Status 200** → API returned data successfully
   - ❌ **Status 401** → Authentication token missing or invalid
   - ❌ **Status 403** → Forbidden (permission denied)
   - ❌ **Status 404** → User not found
   - ❌ **Status 500** → Server error
   - ❌ **Pending (red)** → Request hanging/timeout
   - ❌ **CORS error** → Cross-origin issue

---

### Step 3: Test API Endpoint Directly

**Run this in terminal to test if API is working:**

```bash
# Get your auth token first
TOKEN=$(curl -s -X POST https://3d-inventory-api.ultimasolution.pl/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Now test the getUserById endpoint
curl -v -X GET "https://3d-inventory-api.ultimasolution.pl/users/68e03e971b67a4c671813bda" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected responses:**

✅ **Success (200)**:

```json
{
  "success": true,
  "data": {
    "_id": "68e03e971b67a4c671813bda",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    ...
  }
}
```

❌ **Unauthorized (401)**:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

❌ **Not Found (404)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### Step 4: Check Authentication Token

**In browser console (F12):**

```javascript
// Check if you have a valid token
const token = localStorage.getItem('auth_token')
console.log('Token exists:', !!token)
console.log('Token:', token)

// If token exists, check if it's expired
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('Token payload:', payload)
    console.log('Expires:', new Date(payload.exp * 1000))
    console.log('Is expired:', Date.now() > payload.exp * 1000)
  } catch (e) {
    console.error('Invalid token format')
  }
}
```

---

## Common Causes & Solutions

### Cause 1: Token Expired or Missing

**Symptom:** API returns 401 Unauthorized

**Solution:**

```javascript
// Clear storage and re-login
localStorage.clear()
sessionStorage.clear()
location.href = '/login'
```

Then login again: `admin` / `admin123!`

---

### Cause 2: CORS Issue

**Symptom:** Console shows "CORS policy" error

**Solution:** Check API CORS configuration. The API should allow:

```javascript
origin: 'https://3d-inventory.ultimasolution.pl'
methods: ['GET', 'POST', 'PUT', 'DELETE']
credentials: true
```

**Fix on API side** (if you have access):

```typescript
// API: src/middlewares/security.ts
app.use(
  cors({
    origin: 'https://3d-inventory.ultimasolution.pl',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)
```

---

### Cause 3: User ID Invalid or User Not Found

**Symptom:** API returns 404 Not Found

**Solution:** Get a valid user ID from the user list:

1. Go to: `/admin/users`
2. Find a user in the list
3. Click their Edit button
4. Check the URL for correct ID format

Valid MongoDB ObjectId format: 24 hex characters (e.g., `68e03e971b67a4c671813bda`)

---

### Cause 4: API Permission Check Failing

**Symptom:** API returns 403 Forbidden

**Solution:** The API might be checking permissions separately from the UI. Check API logs for permission errors.

**Test API permissions:**

```bash
# Check what permissions your token has
TOKEN=$(curl -s -X POST https://3d-inventory-api.ultimasolution.pl/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Decode token to see permissions
echo $TOKEN | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .
```

---

### Cause 5: API Endpoint Not Responding

**Symptom:** Request stays "Pending" in Network tab

**Solution:** API server might be down or slow. Check:

```bash
# Test if API is reachable
curl -I https://3d-inventory-api.ultimasolution.pl/health

# Expected: HTTP/1.1 200 OK
```

---

## Quick Fix Workflow

### Method 1: Re-Login and Retry

```
1. Press F12 → Console
2. Run: localStorage.clear(); location.href='/login';
3. Login: admin / admin123!
4. Go to: /admin/users
5. Click Edit button on any user (don't paste URL directly)
6. Check if page loads properly
```

### Method 2: Test in Incognito

```
1. Open Incognito window (Ctrl+Shift+N)
2. Go to: https://3d-inventory.ultimasolution.pl/login
3. Login: admin / admin123!
4. Navigate: Admin → User Management
5. Click Edit on a user
6. Does it load? ✅ / ❌
```

If it works in Incognito → Cache/token issue
If it fails in Incognito → API or permission issue

---

## Debug Script

**Paste this in browser console (F12) to diagnose:**

```javascript
console.log('🔍 Diagnosing "Loading user data..." Issue\n')

// 1. Check authentication
const token = localStorage.getItem('auth_token')
const user = localStorage.getItem('auth_user')

console.log('1. Authentication State:')
console.log('   Token exists:', !!token)
console.log('   User data:', user ? JSON.parse(user) : 'NOT FOUND')

if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = Date.now() > payload.exp * 1000
    console.log('   Token expires:', new Date(payload.exp * 1000))
    console.log('   Is expired:', isExpired ? '❌ YES - NEED TO RE-LOGIN' : '✅ NO')
  } catch (e) {
    console.log('   Token format:', '❌ INVALID')
  }
}

// 2. Check current URL
const url = window.location.href
const match = url.match(/\/admin\/users\/edit\/([a-f0-9]{24})/)
console.log('\n2. Current Page:')
console.log('   URL:', url)
console.log('   User ID:', match ? match[1] : 'NOT FOUND')

// 3. Test API endpoint
if (match && token) {
  const userId = match[1]
  console.log('\n3. Testing API Endpoint...')
  console.log('   Calling: GET /users/' + userId)

  fetch(`https://3d-inventory-api.ultimasolution.pl/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      console.log('   Status:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('   ✅ SUCCESS!')
        console.log('   User data:', data)
        console.log('\n📋 The API is working. Issue might be:')
        console.log('   - Angular HTTP interceptor blocking request')
        console.log('   - Component error handler not working')
        console.log('   - Observable not completing')
      } else if (response.status === 401) {
        console.log('   ❌ UNAUTHORIZED - Token invalid or expired')
        console.log('\n🔧 FIX: Re-login required')
        console.log('   Run: localStorage.clear(); location.href="/login";')
      } else if (response.status === 403) {
        console.log('   ❌ FORBIDDEN - No permission')
        console.log('\n🔧 FIX: Check API permission settings')
      } else if (response.status === 404) {
        console.log('   ❌ NOT FOUND - User does not exist')
        console.log('\n🔧 FIX: Use valid user ID from user list')
      } else {
        const errorText = await response.text()
        console.log('   ❌ ERROR:', errorText)
      }
    })
    .catch((error) => {
      console.log('   ❌ NETWORK ERROR:', error.message)
      console.log('\n📋 Possible causes:')
      console.log('   - CORS blocking request')
      console.log('   - API server down')
      console.log('   - Network connectivity issue')
    })
} else if (!token) {
  console.log('\n❌ No auth token - cannot test API')
  console.log('🔧 FIX: Login first')
} else {
  console.log('\n❌ Not on edit page - cannot extract user ID')
}

// 4. Check for JavaScript errors
console.log('\n4. Check Console Above:')
console.log('   Look for any RED error messages')
console.log('   Common issues:')
console.log('   - Observable subscription errors')
console.log('   - HTTP interceptor errors')
console.log('   - Component initialization errors')
```

---

## What Information to Provide

When reporting the issue, please share:

1. **Browser Console output** (F12 → Console tab)
   - Any error messages in RED
   - Output from debug script above

2. **Network tab details** (F12 → Network tab)
   - Find the `/users/68e03e971b67a4c671813bda` request
   - Status code (200, 401, 403, 404, 500, etc.)
   - Response preview

3. **Token status**
   - Output from token expiration check
   - Is token expired?

4. **Test results**
   - Does it work in Incognito mode?
   - Does re-login fix it?
   - Does clicking Edit button (vs. direct URL) work?

---

## Next Steps

**Please run the debug script above and share:**

- Console output
- Network tab status for /users/:id request
- Any error messages you see

This will help pinpoint the exact cause! 🎯
