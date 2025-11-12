# Production Admin Access Fix - Deployment Guide

## 🚨 CRITICAL ISSUE

**Production Site**: https://3d-inventory.ultimasolution.pl
**Error**: "Access denied: User admin attempted to access admin area without admin role"
**Root Cause**: Production UI code is OLD - missing the role extraction fix

## ✅ Fixes Already Applied (Local Only)

1. **UI Role Extraction** (src/app/shared/user.ts):
   - JwtPayload interface includes `role` and `permissions`

2. **Authentication Service** (src/app/services/authentication.service.ts):
   - Extracts `role: payload.role` from JWT
   - Extracts `permissions: payload.permissions` from JWT

3. **CSRF Cookie Fix** (src/app/services/connection.service.ts):
   - Removed `withCredentials: true`

## 🎯 REQUIRED: Deploy to Production

### Pre-Deployment Checklist

- [x] Local code has role extraction fix
- [x] Local code has CSRF fix
- [ ] Build production bundle
- [ ] Deploy to Google Cloud Run
- [ ] Clear browser cache on production site
- [ ] Test admin access on production

### Step 1: Build Production Bundle

```bash
cd /home/karol/GitHub/3d-inventory-ui

# Build optimized production bundle
npm run build:prod

# Verify build succeeded
ls -la dist/
```

**Expected Output**: `dist/` directory with compiled Angular application

### Step 2: Build Docker Image

```bash
# Build and push to Google Container Registry
./build.sh
```

**This script will**:

1. Build Docker image with latest code changes
2. Tag image as `gcr.io/d-inventory-406007/3d-inventory-ui:latest`
3. Push to Google Container Registry

**Verify**:

```bash
# Check if image was pushed
gcloud container images list --repository=gcr.io/d-inventory-406007
```

### Step 3: Deploy to Google Cloud Run

```bash
# Deploy to production
./deploy.sh
```

**This script will**:

1. Deploy image to Cloud Run service `d-inventory-ui`
2. Configure service with 512Mi memory, 1 CPU
3. Expose on port 8080
4. Output service URL

**Expected Output**:

```
Deployment completed successfully!
Service URL: https://d-inventory-ui-wzwe3odv7q-ew.a.run.app
```

### Step 4: Verify Deployment

```bash
# Check deployment status
gcloud run services describe d-inventory-ui \
  --region europe-west1 \
  --format='value(status.url,status.conditions[0].type,status.conditions[0].status)'
```

**Expected**: URL + Ready + True

### Step 5: Test Production Admin Access

#### A. Clear Browser Cache (CRITICAL!)

**Chrome/Edge**:

1. Press F12 (DevTools)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"

**OR use console**:

```javascript
// Open DevTools Console (F12)
localStorage.clear()
sessionStorage.clear()
caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
location.reload(true)
```

#### B. Login Fresh

1. Navigate to: **https://3d-inventory.ultimasolution.pl/login**
2. Login with admin credentials:
   - Username: `admin`
   - Password: `admin123!`

#### C. Verify Token Has Role

**Browser Console (F12)**:

```javascript
// Check JWT token payload
const token = localStorage.getItem('auth_token')
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  console.log('Role:', payload.role) // Should be: "admin"
  console.log('Permissions:', payload.permissions) // Should be: Array(12)
}

// Check stored user object
const user = JSON.parse(localStorage.getItem('auth_user'))
console.log('User role:', user.role) // Should be: "admin"
```

**Expected Output**:

```
Role: "admin"
Permissions: (12) ["read:devices", "write:devices", ...]
User role: "admin"
```

#### D. Test Admin Access

Navigate to: **https://3d-inventory.ultimasolution.pl/admin/users**

**Expected**:

- ✅ User list displays
- ✅ NO "Access denied" error
- ✅ "Add User" button visible
- ✅ Can create/edit/delete users

### Step 6: Verify API Production Deployment

The API also needs to be deployed with the role support. Check API deployment:

```bash
# Check API deployment status
gcloud run services describe d-inventory-api \
  --region europe-west1 \
  --format='value(status.url)'
```

**Test API login endpoint**:

```bash
curl -X POST https://3d-inventory-api.ultimasolution.pl/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}' | jq .
```

**Expected Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin",  // ← MUST BE PRESENT
    "permissions": ["admin:access", "read:devices", ...]
  }
}
```

### Alternative: One-Command Deployment

```bash
cd /home/karol/GitHub/3d-inventory-ui

# Build, push, and deploy in one go
npm run build:prod && ./build.sh && ./deploy.sh
```

## 🔍 Troubleshooting

### Issue 1: Build Fails

**Error**: `npm run build:prod` fails

**Solution**:

```bash
# Clear Angular cache
rm -rf .angular/cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Try build again
npm run build:prod
```

### Issue 2: Docker Build Fails

**Error**: `./build.sh` fails

**Check**:

1. Verify `.env` file exists with `GHCR_PAT` and `GH_USERNAME`
2. Verify Docker is running: `docker ps`
3. Check Docker credentials: `docker login ghcr.io`

### Issue 3: Deployment Fails

**Error**: `./deploy.sh` fails

**Check**:

```bash
# Verify gcloud authentication
gcloud auth list

# Verify project
gcloud config get-value project
# Should be: d-inventory-406007

# Verify Cloud Run API enabled
gcloud services list --enabled | grep run.googleapis.com
```

### Issue 4: Still Getting "Access Denied" After Deployment

**Possible Causes**:

1. **Old cached UI**:
   - Solution: Hard refresh (Ctrl+Shift+R)
   - Clear all browser data for the site

2. **Old JWT token**:
   - Solution: Logout, clear localStorage, login fresh

3. **API not updated**:
   - Solution: Deploy API with role support
   - Verify API login response includes `role` field

4. **Database user missing role**:
   - Solution: Run on API server:
   ```bash
   cd /home/karol/GitHub/3d-inventory-api
   npm run verify:admin
   ```

### Issue 5: CORS Errors on Production

**Error**: CORS policy blocks requests

**Check API CORS configuration**:

```bash
# Verify API allows production UI origin
# In API src/main.ts allowedOrigins should include:
# - 'https://3d-inventory.ultimasolution.pl'
# - 'https://d-inventory-ui-wzwe3odv7q-ew.a.run.app'
```

## 📋 Deployment Verification Checklist

After deployment, verify:

- [ ] Production UI loads: https://3d-inventory.ultimasolution.pl
- [ ] Login page works
- [ ] Login with admin credentials succeeds
- [ ] JWT token in localStorage contains `role: "admin"`
- [ ] User object in localStorage contains `role: "admin"`
- [ ] Navigation to /admin/users works (no access denied)
- [ ] User list displays
- [ ] Can add new user
- [ ] Can edit existing user
- [ ] Can delete user
- [ ] No CSRF cookie errors in console
- [ ] No CORS errors in console

## 🚀 Quick Deployment Commands

```bash
# Full deployment from scratch
cd /home/karol/GitHub/3d-inventory-ui

# 1. Build production bundle
npm run build:prod

# 2. Build and push Docker image
./build.sh

# 3. Deploy to Cloud Run
./deploy.sh

# 4. Verify deployment
gcloud run services describe d-inventory-ui --region europe-west1

# 5. Open production site
xdg-open https://3d-inventory.ultimasolution.pl
```

## 📝 Post-Deployment Testing Script

Create this test script:

```bash
#!/bin/bash
# test-production.sh

echo "Testing Production Deployment..."
echo ""

# Test API health
echo "1. Testing API health..."
API_HEALTH=$(curl -s https://3d-inventory-api.ultimasolution.pl/health | jq -r '.status')
echo "   API Status: $API_HEALTH"

# Test API login
echo "2. Testing API login..."
LOGIN_RESPONSE=$(curl -s -X POST https://3d-inventory-api.ultimasolution.pl/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}')

HAS_ROLE=$(echo $LOGIN_RESPONSE | jq -r '.user.role')
echo "   User role in response: $HAS_ROLE"

if [ "$HAS_ROLE" = "admin" ]; then
  echo "   ✅ API returns admin role"
else
  echo "   ❌ API missing role field"
fi

# Test UI
echo "3. Testing UI deployment..."
UI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://3d-inventory.ultimasolution.pl)
echo "   UI Status Code: $UI_STATUS"

if [ "$UI_STATUS" = "200" ]; then
  echo "   ✅ UI is accessible"
else
  echo "   ❌ UI returned status: $UI_STATUS"
fi

echo ""
echo "Next steps:"
echo "1. Clear browser cache"
echo "2. Login at: https://3d-inventory.ultimasolution.pl/login"
echo "3. Test admin access: https://3d-inventory.ultimasolution.pl/admin/users"
```

## 🎯 Expected Timeline

1. **Build**: 2-3 minutes
2. **Docker build & push**: 3-5 minutes
3. **Cloud Run deployment**: 2-3 minutes
4. **Browser cache clear**: 30 seconds
5. **Testing**: 2 minutes

**Total**: ~10-15 minutes

## 🔐 Security Notes

- Production deployment uses HTTPS
- JWT tokens expire after 24 hours
- Admin role required for /admin/\* routes
- CORS restricted to allowed origins
- No cookies used (Bearer token only)

## 📚 Related Documentation

- **CSRF-FIX-SUMMARY.md**: CSRF cookie fix details
- **ADMIN-ACCESS-FINAL-VERIFICATION.md**: Admin access testing guide
- **ADMIN-FIX-COMPLETE.md**: Admin role fix summary

---

**CRITICAL**: The fixes are only on your LOCAL machine. You MUST deploy to production for the fixes to work on https://3d-inventory.ultimasolution.pl

**Deploy now**: `npm run build:prod && ./build.sh && ./deploy.sh`
