# 🚨 URGENT: Deploy UI to Production

## Problem Confirmed

**Production API** ✅ CORRECT - Sends `role: "admin"` in JWT
**Production UI** ❌ OLD CODE - Doesn't extract `role` from JWT

**Result**: AdminGuard denies access because `user.role` is `undefined`

## JWT Proof (from production API)

```json
{
  "id": "68e03e971b67a4c671813bda",
  "username": "admin",
  "role": "admin",           // ← API SENDS THIS
  "permissions": [...]
}
```

But production UI code doesn't extract it!

## ⚡ Quick Fix - Deploy NOW

```bash
cd /home/karol/GitHub/3d-inventory-ui

# One command to deploy everything
npm run build:prod && ./build.sh && ./deploy.sh
```

**Time**: ~10-15 minutes

## Step-by-Step (if one-command fails)

### 1. Build Production Bundle

```bash
cd /home/karol/GitHub/3d-inventory-ui
npm run build:prod
```

Wait for: `✔ Browser application bundle generation complete.`

### 2. Build & Push Docker Image

```bash
./build.sh
```

Wait for: `Successfully tagged gcr.io/d-inventory-406007/3d-inventory-ui:latest`

### 3. Deploy to Cloud Run

```bash
./deploy.sh
```

Wait for: `Deployment completed successfully!`

### 4. Clear Browser Cache & Test

**CRITICAL**: Production site has old cached code!

1. Open: https://3d-inventory.ultimasolution.pl
2. Press F12 (DevTools)
3. Right-click Refresh button → "Empty Cache and Hard Reload"
4. Go to Console tab and run:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

### 5. Login Fresh

1. Go to: https://3d-inventory.ultimasolution.pl/login
2. Login: `admin` / `admin123!`
3. Check console (F12):

   ```javascript
   const token = localStorage.getItem('auth_token')
   const payload = JSON.parse(atob(token.split('.')[1]))
   console.log('Role:', payload.role) // Should be: "admin"

   const user = JSON.parse(localStorage.getItem('auth_user'))
   console.log('User role:', user.role) // Should be: "admin" (after deployment)
   ```

### 6. Test Admin Access

Navigate to: https://3d-inventory.ultimasolution.pl/admin/users

**Expected**: User list displays, NO "Access denied" error ✅

## What Will Be Deployed

### File 1: `src/app/shared/user.ts`

```typescript
export interface JwtPayload {
  id: string
  username: string
  role?: string // ← ADDED
  permissions?: string[] // ← ADDED
  iat?: number
  exp?: number
}
```

### File 2: `src/app/services/authentication.service.ts`

```typescript
const user: User = {
  _id: payload.id.toString(),
  username: payload.username,
  email: `${payload.username}@example.com`,
  permissions: payload.permissions || [], // ← ADDED
  role: payload.role, // ← ADDED (CRITICAL!)
  token: response.token,
}
```

### File 3: `src/app/services/connection.service.ts`

```typescript
httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // withCredentials removed (CSRF fix)
}
```

## Verification After Deployment

### Test 1: API Still Works

```bash
curl -X POST https://3d-inventory-api.ultimasolution.pl/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}' | jq '.user.role'
```

**Expected**: `"admin"` ✅

### Test 2: UI Extracts Role

After deployment and cache clear:

1. Login to production site
2. Browser console:
   ```javascript
   JSON.parse(localStorage.getItem('auth_user')).role
   ```
   **Expected**: `"admin"` ✅

### Test 3: Admin Access Works

Navigate to: https://3d-inventory.ultimasolution.pl/admin/users

**Expected**: User list, no errors ✅

## If Deployment Fails

### Error: "GHCR_PAT not set"

```bash
# Check .env file
cat .env | grep GHCR_PAT

# If missing, add to .env:
echo "GHCR_PAT=your_github_token" >> .env
echo "GH_USERNAME=your_github_username" >> .env
```

### Error: "gcloud command not found"

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### Error: "Permission denied"

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set project
gcloud config set project d-inventory-406007
```

### Error: Build script permission denied

```bash
chmod +x build.sh deploy.sh
```

## Why This Happens

1. **Local Code**: Has role extraction fix ✅
2. **Production Code**: OLD code from before fix ❌
3. **API**: Already sends role ✅
4. **UI**: Needs deployment to use new code ✅

## After Deployment Success

You should see:

- ✅ Login works on production
- ✅ JWT token has role field
- ✅ User object has role field
- ✅ Admin access to /admin/users works
- ✅ No "Access denied" error
- ✅ No CSRF cookie errors

## Timeline

- Build: 2-3 min
- Docker: 3-5 min
- Deploy: 2-3 min
- **Total**: ~10 min

## 🎯 DO THIS NOW

```bash
cd /home/karol/GitHub/3d-inventory-ui
npm run build:prod && ./build.sh && ./deploy.sh
```

Then clear browser cache and test!

---

**TL;DR**: Your local code has the fix. Production doesn't. Deploy now! 🚀
