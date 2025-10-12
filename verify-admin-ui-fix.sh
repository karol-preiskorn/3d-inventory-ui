#!/bin/bash

# Admin Access UI Fix - Verification Script
# This script helps verify that the admin user can access the admin area in the UI

echo "=================================================="
echo "🔍 Admin Access UI Fix - Verification Script"
echo "=================================================="
echo ""
echo "Date: $(date)"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Verify database
echo "📋 Step 1: Verifying admin user in database..."
echo "----------------------------------------------"
cd /home/karol/GitHub/3d-inventory-api
npm run verify:admin

echo ""
echo "=================================================="
echo ""

# Step 2: Check UI files were updated
echo "📝 Step 2: Checking UI files..."
echo "----------------------------------------------"

cd /home/karol/GitHub/3d-inventory-ui

# Check if JwtPayload has role field
if grep -q "role\?: string" src/app/shared/user.ts; then
    echo -e "${GREEN}✅ JwtPayload interface includes role field${NC}"
else
    echo -e "${RED}❌ JwtPayload interface missing role field${NC}"
    echo "   Fix: Update src/app/shared/user.ts"
fi

# Check if authentication service extracts role
if grep -q "role: payload.role" src/app/services/authentication.service.ts; then
    echo -e "${GREEN}✅ Authentication service extracts role from JWT${NC}"
else
    echo -e "${RED}❌ Authentication service not extracting role${NC}"
    echo "   Fix: Update src/app/services/authentication.service.ts"
fi

# Check if authentication service extracts permissions
if grep -q "permissions: payload.permissions" src/app/services/authentication.service.ts; then
    echo -e "${GREEN}✅ Authentication service extracts permissions from JWT${NC}"
else
    echo -e "${YELLOW}⚠️  Authentication service not extracting permissions${NC}"
fi

echo ""
echo "=================================================="
echo ""

# Step 3: Instructions
echo "📋 Step 3: Next Steps for Testing"
echo "----------------------------------------------"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: You must rebuild the UI and clear browser storage!${NC}"
echo ""
echo "1️⃣  Rebuild the UI:"
echo "   cd /home/karol/GitHub/3d-inventory-ui"
echo "   npm run build"
echo ""
echo "2️⃣  Clear browser storage (in Browser DevTools F12):"
echo "   localStorage.clear()"
echo "   sessionStorage.clear()"
echo "   location.reload()"
echo ""
echo "3️⃣  Login fresh with admin credentials:"
echo "   Username: admin"
echo "   Password: admin123!"
echo ""
echo "4️⃣  Verify token has role (in Browser Console):"
echo "   const token = localStorage.getItem('auth_token')"
echo "   const payload = JSON.parse(atob(token.split('.')[1]))"
echo "   console.log('Role:', payload.role)  // Should be 'admin'"
echo ""
echo "5️⃣  Test admin access:"
echo "   Navigate to: http://localhost:4200/admin/users"
echo "   Should see user list without 'Access denied' error"
echo ""
echo "=================================================="
echo ""
echo -e "${GREEN}✅ Verification script completed!${NC}"
echo ""
echo "See ADMIN-ACCESS-UI-FIX.md for detailed documentation"
echo ""
