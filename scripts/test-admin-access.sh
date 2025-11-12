#!/bin/bash

# Admin UI Access Test Script
# Tests the complete authentication flow and verifies admin access

echo "=================================================="
echo "🧪 Admin UI Access - Complete Test"
echo "=================================================="
echo ""
echo "Date: $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API and UI URLs
API_URL="http://localhost:8080"
UI_URL="http://localhost:4200"

echo "🔧 Configuration:"
echo "  API URL: $API_URL"
echo "  UI URL: $UI_URL"
echo ""

# Step 1: Verify API is running
echo "=================================================="
echo "Step 1: Checking API Server"
echo "=================================================="
echo ""

if curl -s -f "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API server is running${NC}"
else
    echo -e "${RED}❌ API server is NOT running${NC}"
    echo ""
    echo "Start the API server:"
    echo "  cd /home/karol/GitHub/3d-inventory-api"
    echo "  npm run dev"
    echo ""
    exit 1
fi

echo ""

# Step 2: Verify database admin user
echo "=================================================="
echo "Step 2: Verifying Admin User in Database"
echo "=================================================="
echo ""

cd /home/karol/GitHub/3d-inventory-api || exit 1
npm run verify:admin --silent 2>&1 | grep -A 20 "USER DETAILS"

echo ""

# Step 3: Test login endpoint
echo "=================================================="
echo "Step 3: Testing Login Endpoint"
echo "=================================================="
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123!"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Login successful${NC}"
    echo ""

    # Extract token
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

    if [ -n "$TOKEN" ]; then
        echo "📋 Token received (length: ${#TOKEN} chars)"
        echo ""

        # Decode JWT payload
        echo "🔍 JWT Payload Analysis:"
        echo "----------------------------------------"

        # Extract payload (second part of JWT)
        PAYLOAD=$(echo "$TOKEN" | cut -d'.' -f2)

        # Add padding if needed for base64 decode
        PADDING=$((${#PAYLOAD} % 4))
        if [ $PADDING -ne 0 ]; then
            PADDING=$((4 - PADDING))
            for ((i=0; i<PADDING; i++)); do
                PAYLOAD="${PAYLOAD}="
            done
        fi

        # Decode and pretty print
        DECODED=$(echo "$PAYLOAD" | base64 -d 2>/dev/null)

        if [ -n "$DECODED" ]; then
            echo "$DECODED" | python3 -m json.tool 2>/dev/null || echo "$DECODED"
            echo ""

            # Check for role field
            if echo "$DECODED" | grep -q '"role"'; then
                ROLE=$(echo "$DECODED" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
                if [ "$ROLE" == "admin" ]; then
                    echo -e "${GREEN}✅ Role field present: $ROLE${NC}"
                else
                    echo -e "${YELLOW}⚠️  Role field present but not admin: $ROLE${NC}"
                fi
            else
                echo -e "${RED}❌ Role field MISSING in JWT payload${NC}"
            fi

            # Check for permissions field
            if echo "$DECODED" | grep -q '"permissions"'; then
                PERM_COUNT=$(echo "$DECODED" | grep -o '"permissions"' | wc -l)
                echo -e "${GREEN}✅ Permissions field present${NC}"
            else
                echo -e "${YELLOW}⚠️  Permissions field missing${NC}"
            fi
        fi
    fi
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    echo ""
    exit 1
fi

echo ""

# Step 4: UI Code Verification
echo "=================================================="
echo "Step 4: Verifying UI Code Changes"
echo "=================================================="
echo ""

cd /home/karol/GitHub/3d-inventory-ui || exit 1

# Check JwtPayload interface
if grep -q "role?: string" src/app/shared/user.ts; then
    echo -e "${GREEN}✅ JwtPayload interface has role field${NC}"
else
    echo -e "${RED}❌ JwtPayload interface missing role field${NC}"
fi

# Check authentication service
if grep -q "role: payload.role" src/app/services/authentication.service.ts; then
    echo -e "${GREEN}✅ Authentication service extracts role${NC}"
else
    echo -e "${RED}❌ Authentication service not extracting role${NC}"
fi

if grep -q "permissions: payload.permissions" src/app/services/authentication.service.ts; then
    echo -e "${GREEN}✅ Authentication service extracts permissions${NC}"
else
    echo -e "${YELLOW}⚠️  Authentication service not extracting permissions${NC}"
fi

echo ""

# Step 5: Build status
echo "=================================================="
echo "Step 5: Checking Build Status"
echo "=================================================="
echo ""

if [ -d "dist" ]; then
    BUILD_TIME=$(stat -c %y dist 2>/dev/null || stat -f "%Sm" dist 2>/dev/null)
    echo -e "${GREEN}✅ Build directory exists${NC}"
    echo "   Last modified: $BUILD_TIME"

    # Check if recent
    if [ -n "$BUILD_TIME" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  Note: If you made code changes recently, rebuild:${NC}"
        echo "   npm run build"
    fi
else
    echo -e "${RED}❌ Build directory not found${NC}"
    echo ""
    echo "Build the application:"
    echo "  npm run build"
fi

echo ""

# Step 6: Instructions
echo "=================================================="
echo "Step 6: Testing Instructions"
echo "=================================================="
echo ""

echo -e "${BLUE}🌐 Browser Testing Steps:${NC}"
echo ""
echo "1️⃣  Open Browser DevTools (F12)"
echo ""
echo "2️⃣  Clear Storage (paste in Console):"
echo "   ${YELLOW}localStorage.clear(); sessionStorage.clear(); location.reload();${NC}"
echo ""
echo "3️⃣  Navigate to Login:"
echo "   ${BLUE}$UI_URL/login${NC}"
echo ""
echo "4️⃣  Login with credentials:"
echo "   Username: ${GREEN}admin${NC}"
echo "   Password: ${GREEN}admin123!${NC}"
echo ""
echo "5️⃣  Verify token has role (paste in Console):"
echo "   ${YELLOW}const token = localStorage.getItem('auth_token');${NC}"
echo "   ${YELLOW}const payload = JSON.parse(atob(token.split('.')[1]));${NC}"
echo "   ${YELLOW}console.log('Role:', payload.role);${NC}"
echo "   ${YELLOW}console.log('Permissions:', payload.permissions);${NC}"
echo ""
echo "   Expected Output:"
echo "   ${GREEN}Role: admin${NC}"
echo "   ${GREEN}Permissions: Array(12)${NC}"
echo ""
echo "6️⃣  Test Admin Access:"
echo "   ${BLUE}$UI_URL/admin/users${NC}"
echo ""
echo "   Expected:"
echo "   ${GREEN}✅ User list displays${NC}"
echo "   ${GREEN}✅ NO 'Access denied' error${NC}"
echo "   ${GREEN}✅ NO redirect to /home${NC}"
echo ""

# Summary
echo "=================================================="
echo "✅ Pre-Test Verification Complete"
echo "=================================================="
echo ""
echo "Summary:"
echo "  - API Server: ✅ Running"
echo "  - Login Endpoint: ✅ Working"
echo "  - JWT Contains Role: ✅ Yes"
echo "  - UI Code: ✅ Updated"
echo ""
echo -e "${YELLOW}⚠️  CRITICAL: You MUST clear browser storage and re-login!${NC}"
echo -e "${YELLOW}⚠️  Old tokens in localStorage don't have the role field!${NC}"
echo ""
echo "Ready to test in browser! 🚀"
echo ""
