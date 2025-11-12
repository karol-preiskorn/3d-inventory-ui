#!/bin/bash

# Script to find potential disabled attribute issues in Angular reactive forms
echo "🔍 Searching for potential disabled attribute issues in reactive forms..."
echo "=================================================================="

echo ""
echo "1. Looking for form controls with disabled attribute:"
grep -r -n --include="*.html" "disabled.*formControlName\|formControlName.*disabled" src/

echo ""
echo "2. Looking for any disabled attributes on input/select/textarea elements:"
grep -r -n --include="*.html" -A 2 -B 2 "disabled.*=.*true\|disabled.*=.*false" src/

echo ""
echo "3. Looking for conditionally disabled form elements:"
grep -r -n --include="*.html" "\[disabled\].*formControlName\|formControlName.*\[disabled\]" src/

echo ""
echo "4. Looking for any form controls that might be dynamically disabled:"
grep -r -n --include="*.ts" "\.disable()\|\.enable()" src/

echo ""
echo "5. Looking for FormControl initialization with disabled property:"
grep -r -n --include="*.ts" "FormControl.*disabled\|disabled.*FormControl" src/

echo ""
echo "=================================================================="
echo "✅ Search completed. Review the results above to identify issues."
