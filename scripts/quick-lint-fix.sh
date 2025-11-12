#!/bin/bash

# Quick Lint Fixes Script
# This script helps you fix common linting issues automatically

echo "🔧 Running Quick Lint Fixes..."

# 1. Fix equality operators (== to ===, != to !==)
echo "📝 Fixing equality operators..."

# Create backup
cp -r src src_backup_$(date +%Y%m%d_%H%M%S)

# Fix == to === (but not ===/!== or comparison operators)
find src -name "*.ts" -not -path "*/node_modules/*" -exec sed -i 's/\([^=!]\)==\([^=]\)/\1===\2/g' {} \;

# Fix != to !== (but not !== or other operators)
find src -name "*.ts" -not -path "*/node_modules/*" -exec sed -i 's/\([^!]\)!=\([^=]\)/\1!==\2/g' {} \;

echo "✅ Equality operators fixed"

# 2. Remove common unused imports
echo "📝 Removing common unused imports..."

# Remove unused RxJS operators
find src -name "*.ts" -exec sed -i '/import.*{.*of.*}.*rxjs.*; \/\/ unused/d' {} \;

# Remove unused Angular imports
find src -name "*.ts" -exec sed -i '/import.*{.*DebugElement.*}.*@angular\/core.*; \/\/ unused/d' {} \;

echo "✅ Common unused imports removed"

# 3. Add missing curly braces to single-line if statements
echo "📝 Adding missing curly braces..."

find src -name "*.ts" -exec sed -i '/if.*[^{]$/N; s/\(if.*[^{]\)\n\([ ]*[^}].*\)/\1 {\n\2\n}/g' {} \;

echo "✅ Curly braces added"

# 4. Run ESLint auto-fix
echo "📝 Running ESLint auto-fix..."
npm run lint:eslint > /dev/null 2>&1

# 5. Run Prettier
echo "📝 Running Prettier..."
npm run lint:prettier > /dev/null 2>&1

# 6. Show final lint status
echo ""
echo "🎯 Final Lint Status:"
npm run lint 2>&1 | tail -n 5

echo ""
echo "✨ Quick fixes complete!"
echo "📁 Backup created in: src_backup_$(date +%Y%m%d_%H%M%S)"
echo ""
echo "📋 Next steps:"
echo "1. Review changes with: git diff"
echo "2. Fix remaining complex issues manually"
echo "3. Add proper TypeScript types"
echo "4. Implement OnPush change detection"
echo "5. Replace console.log with proper logging"
