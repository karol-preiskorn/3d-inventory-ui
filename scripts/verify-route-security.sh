#!/bin/bash

# Route Security Verification Script
# Checks which routes have AuthGuard protection

echo "🔍 Analyzing Route Security Configuration"
echo "=========================================="
echo ""

ROUTES_FILE="/home/karol/GitHub/3d-inventory-ui/src/app/app-routing.module.ts"

echo "📋 Protected Routes (with AuthGuard):"
echo "-------------------------------------"
grep -E "path:.*canActivate.*AuthGuard" "$ROUTES_FILE" | \
  sed -E "s/.*path: '([^']+)'.*/  ✅ \/\1/" | \
  sort

echo ""
echo "⚠️  Public Routes (NO AuthGuard):"
echo "-------------------------------------"
grep -E "path: '[^']+'" "$ROUTES_FILE" | \
  grep -v "canActivate" | \
  grep -v "children:" | \
  sed -E "s/.*path: '([^']+)'.*/  ❌ \/\1/" | \
  grep -v "/\*\*" | \
  sort

echo ""
echo "📊 Summary:"
echo "-------------------------------------"
PROTECTED_COUNT=$(grep -c "canActivate.*AuthGuard" "$ROUTES_FILE")
TOTAL_ROUTES=$(grep -c "path: '" "$ROUTES_FILE")

echo "  Protected Routes: $PROTECTED_COUNT"
echo "  Total Routes: $TOTAL_ROUTES"
echo "  Coverage: $(awk "BEGIN {printf \"%.1f%%\", ($PROTECTED_COUNT/$TOTAL_ROUTES)*100}")"
echo ""

echo "✅ Verification complete!"
echo ""
echo "Expected Public Routes:"
echo "  - / (home)"
echo "  - /login"
echo "  - /** (wildcard redirect)"
echo ""
echo "All other routes should require authentication."
