# MIME Type Error Fix - Angular JavaScript Modules

## Date: October 11, 2025

## 🔥 Problem

**Error Message:**

```
Loading module from "https://3d-inventory.ultimasolution.pl/edit-device/polyfills-KRVD37DN.js" was blocked because of a disallowed MIME type ("text/html").
```

## 🎯 Root Cause

The error occurs when nginx serves HTML content (typically `index.html`) instead of JavaScript files. This happens because:

1. **Incorrect MIME Type**: Nginx returns `text/html` instead of `application/javascript` for `.js` files
2. **Fallback Issue**: The `try_files $uri $uri/ /index.html;` directive catches ALL requests, including static assets
3. **Missing File**: The requested JavaScript file doesn't exist at the expected path, so nginx falls back to `index.html`

## ✅ Solution Applied

### 1. **Updated nginx Configuration** (`default.conf`)

Added explicit MIME type definitions and proper static file handling:

```nginx
# Ensure proper MIME types for JavaScript modules and other files
types {
  application/javascript js mjs;
  text/css css;
  text/html html htm;
  application/json json;
  image/svg+xml svg svgz;
  image/png png;
  image/jpeg jpg jpeg;
  image/gif gif;
  image/webp webp;
  font/woff woff;
  font/woff2 woff2;
  font/ttf ttf;
  font/eot eot;
}

# Serve static files (JS, CSS, assets) directly with proper caching
# This prevents the try_files fallback from serving index.html for these files
location ~ \.(js|mjs|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map|webp)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
  add_header X-Content-Type-Options "nosniff" always;
  try_files $uri =404;
}

# Special handling for polyfills and other critical JS files
location ~* ^.+\.(js|mjs)$ {
  add_header Content-Type application/javascript;
  add_header X-Content-Type-Options "nosniff" always;
  try_files $uri =404;
}
```

### 2. **Key Changes**

- ✅ **Explicit MIME Types**: Defined MIME types for `.js`, `.mjs`, and other file types
- ✅ **Static File Priority**: Static files are matched BEFORE the fallback route
- ✅ **Return 404**: Missing static files return 404 instead of falling back to `index.html`
- ✅ **Content-Type Headers**: Explicitly set `Content-Type: application/javascript` for JS files
- ✅ **Security Headers**: Added `X-Content-Type-Options: nosniff` to prevent MIME sniffing

## 🔍 How It Works

### Request Flow After Fix

1. **Browser requests**: `https://3d-inventory.ultimasolution.pl/polyfills-KRVD37DN.js`
2. **Nginx checks**: First location block `~ \.(js|mjs|...)$` matches
3. **Nginx serves**: File with `Content-Type: application/javascript`
4. **Browser receives**: Correct MIME type, loads module successfully

### Before Fix (What Was Wrong)

1. **Browser requests**: `https://3d-inventory.ultimasolution.pl/edit-device/polyfills-KRVD37DN.js`
2. **Nginx checks**: Falls through to `location /` block
3. **Nginx serves**: `index.html` with `Content-Type: text/html`
4. **Browser rejects**: "Disallowed MIME type" error

## 🚀 Deployment Steps

### 1. **Rebuild Docker Image**

```bash
cd /home/karol/GitHub/3d-inventory-ui
docker build -t 3d-inventory-ui .
```

### 2. **Test Locally**

```bash
# Run container locally
docker run -p 8080:8080 3d-inventory-ui

# Test in browser
# Open http://localhost:8080
# Check browser console for MIME type errors
```

### 3. **Deploy to Production**

```bash
cd /home/karol/GitHub/3d-inventory-ui
./build.sh
```

### 4. **Verify Fix**

After deployment:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to your app
4. Check JavaScript file responses:
   - **Status**: Should be `200 OK` (not `404`)
   - **Content-Type**: Should be `application/javascript` (not `text/html`)
   - **Response**: Should be JavaScript code (not HTML)

## 🔧 Troubleshooting

### Issue: Still Getting MIME Type Errors

**Check 1: Build Output**

```bash
# Verify files exist in dist/browser
ls -la /home/karol/GitHub/3d-inventory-ui/dist/browser/

# Look for polyfills-*.js files
ls -la /home/karol/GitHub/3d-inventory-ui/dist/browser/*.js
```

**Check 2: Docker Image**

```bash
# Inspect Docker image contents
docker run --rm 3d-inventory-ui ls -la /usr/share/nginx/html/

# Check for JavaScript files
docker run --rm 3d-inventory-ui ls -la /usr/share/nginx/html/*.js
```

**Check 3: Nginx Configuration**

```bash
# Test nginx config
docker run --rm 3d-inventory-ui nginx -t

# View active configuration
docker run --rm 3d-inventory-ui cat /etc/nginx/conf.d/default.conf
```

### Issue: 404 for JavaScript Files

This means the files aren't in the Docker image:

**Solution:**

```bash
# Check Dockerfile build output path
# Should be: COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html

# Verify Angular build output
npm run build
ls -la dist/browser/
```

### Issue: Wrong Base Href

If your app is deployed to a subdirectory (e.g., `/app/`):

**Solution:**

```bash
# Build with base href
ng build --base-href=/app/

# Or update angular.json
"baseHref": "/app/"
```

## 📊 Verification Checklist

After deployment, verify:

- [ ] Application loads without JavaScript errors
- [ ] Browser console shows no MIME type errors
- [ ] Network tab shows `200 OK` for all `.js` files
- [ ] All `.js` files have `Content-Type: application/javascript`
- [ ] Static assets (images, fonts) load correctly
- [ ] Routing works (refresh on any page should work)
- [ ] No `404` errors for critical files

## 🎓 Best Practices Applied

1. **MIME Type Declarations**: Explicit MIME types prevent ambiguity
2. **Static File Priority**: Handle static files before SPA fallback
3. **Security Headers**: Prevent MIME type sniffing attacks
4. **Proper Caching**: Long-term caching for immutable assets
5. **404 for Missing Files**: Don't serve HTML for missing static files

## 📚 Related Documentation

- **Nginx Configuration**: `default.conf`
- **Dockerfile**: Build and deployment configuration
- **Angular Build**: `angular.json` output configuration

## 🔗 Additional Resources

- [MDN: MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [Nginx MIME Types](http://nginx.org/en/docs/http/ngx_http_core_module.html#types)
- [Angular Deployment](https://angular.io/guide/deployment)
- [SPA Nginx Configuration](https://www.nginx.com/blog/deploying-nginx-plus-as-an-api-gateway-part-1/)

---

**Status**: ✅ **FIXED**
**Files Modified**: `default.conf`
**Next Step**: Rebuild Docker image and deploy

**Implementation Date**: October 11, 2025
**Issue**: MIME type error for JavaScript modules
**Solution**: Proper nginx MIME type and static file handling
