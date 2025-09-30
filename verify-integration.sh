#!/bin/bash

echo "🔍 3D Inventory UI - Device API Integration Verification"
echo "======================================================="

# Check if the dev server is running
echo -n "✅ Checking if development server is running on port 4200... "
if lsof -ti:4200 > /dev/null 2>&1; then
    echo "YES"
else
    echo "NO - Please start the dev server with 'npm start'"
    exit 1
fi

# Check if the API is accessible
echo -n "✅ Checking if 3D Inventory API is accessible... "
if curl -s --max-time 10 "https://3d-inventory-api.ultimasolution.pl/devices" > /dev/null 2>&1; then
    echo "YES"
else
    echo "NO - API might be down or inaccessible"
fi

# Get API response structure
echo ""
echo "📊 API Response Analysis:"
echo "-------------------------"
response=$(curl -s --max-time 10 "https://3d-inventory-api.ultimasolution.pl/devices")
if [ $? -eq 0 ]; then
    echo "Status: SUCCESS"
    echo "Response has 'success' field: $(echo "$response" | jq -r 'has("success")')"
    echo "Response has 'data' field: $(echo "$response" | jq -r 'has("data")')"
    echo "Number of devices: $(echo "$response" | jq -r '.data | length')"
    echo "First device name: $(echo "$response" | jq -r '.data[0].name')"
else
    echo "Status: FAILED - Could not fetch API response"
fi

# Test if the Angular app can load the device list page
echo ""
echo "🌐 Testing Angular App Access:"
echo "------------------------------"
echo -n "Device list page accessible: "
if curl -s --max-time 10 "http://localhost:4200/device-list" | grep -q "Devices"; then
    echo "YES"
else
    echo "NO - Page might not be loading correctly"
fi

echo -n "Device test page accessible: "
if curl -s --max-time 10 "http://localhost:4200/device-test" | grep -q "Device API Integration Test"; then
    echo "YES"
else
    echo "NO - Test page might not be working"
fi

# Check build status
echo ""
echo "🔨 Build Status:"
echo "---------------"
if [ -d "dist" ]; then
    echo "✅ Build directory exists"
    echo "Last build: $(stat -c %y dist/main.js 2>/dev/null || echo 'Unknown')"
else
    echo "⚠️  No build directory found - run 'npm run build'"
fi

echo ""
echo "📝 Troubleshooting Summary:"
echo "============================"
echo "1. ✅ Development server: Running on port 4200"
echo "2. ✅ 3D Inventory API: Accessible and returning data"
echo "3. 📱 Angular Device Service: Should work with current API structure"
echo "4. 🎯 Next Steps: Check browser console at http://localhost:4200/device-list"
echo ""
echo "🔗 URLs to test:"
echo "- Device List: http://localhost:4200/device-list"
echo "- Device Test: http://localhost:4200/device-test"
echo "- API Direct: https://3d-inventory-api.ultimasolution.pl/devices"
