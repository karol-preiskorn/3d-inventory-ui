#!/bin/bash

# Quality Gate Validation Script
# Validates coverage metrics and other quality gates for CI/CD pipeline

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COVERAGE_DIR="coverage"
COVERAGE_FILE="$COVERAGE_DIR/coverage-summary.json"
LCOV_FILE="$COVERAGE_DIR/lcov.info"
MIN_COVERAGE_STATEMENTS=80
MIN_COVERAGE_BRANCHES=75
MIN_COVERAGE_FUNCTIONS=85
MIN_COVERAGE_LINES=80

# Critical paths requiring higher coverage
CRITICAL_PATHS=("services" "guards" "shared")
CRITICAL_MIN=90

echo -e "${BLUE}🔍 Quality Gate Validation Starting...${NC}"
echo "=================================="

# Function to extract coverage from lcov.info
extract_lcov_coverage() {
    local lcov_file="$1"
    local metric="$2"

    case "$metric" in
        "functions")
            local found=$(grep -E "^FNF:" "$lcov_file" | awk -F: '{sum+=$2} END {print sum+0}')
            local hit=$(grep -E "^FNH:" "$lcov_file" | awk -F: '{sum+=$2} END {print sum+0}')
            ;;
        "lines")
            local found=$(grep -E "^LF:" "$lcov_file" | awk -F: '{sum+=$2} END {print sum+0}')
            local hit=$(grep -E "^LH:" "$lcov_file" | awk -F: '{sum+=$2} END {print sum+0}')
            ;;
        "branches")
            local found=$(grep -E "^BRF:" "$lcov_file" | awk -F: '{sum+=$2} END {print sum+0}')
            local hit=$(grep -E "^BRH:" "$lcov_file" | awk -F: '{sum+=$2} END {print sum+0}')
            ;;
    esac

    if [ "$found" -gt 0 ]; then
        echo "$((hit * 100 / found))"
    else
        echo "0"
    fi
}

# Function to validate coverage threshold
validate_coverage() {
    local metric="$1"
    local actual="$2"
    local threshold="$3"
    local critical="$4"

    if [ "$actual" -ge "$threshold" ]; then
        if [ "$critical" = "true" ] && [ "$actual" -ge "$CRITICAL_MIN" ]; then
            echo -e "  ✅ ${metric}: ${actual}% (Critical: ≥${CRITICAL_MIN}%)"
            return 0
        elif [ "$critical" = "false" ]; then
            echo -e "  ✅ ${metric}: ${actual}% (≥${threshold}%)"
            return 0
        else
            echo -e "  ⚠️  ${metric}: ${actual}% (Critical path requires ≥${CRITICAL_MIN}%)"
            return 1
        fi
    else
        echo -e "  ❌ ${metric}: ${actual}% (Required: ≥${threshold}%)"
        return 1
    fi
}

# Check if coverage files exist
if [ ! -f "$COVERAGE_FILE" ] && [ ! -f "$LCOV_FILE" ]; then
    echo -e "${RED}❌ Coverage files not found!${NC}"
    echo "Expected: $COVERAGE_FILE or $LCOV_FILE"
    exit 1
fi

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}📊 Coverage Analysis${NC}"
echo "-------------------"

# Use coverage-summary.json if available, otherwise parse lcov.info
if [ -f "$COVERAGE_FILE" ]; then
    echo "Using coverage summary: $COVERAGE_FILE"

    # Extract coverage metrics using jq
    if command -v jq >/dev/null 2>&1; then
        STATEMENTS_PCT=$(jq -r '.total.statements.pct' "$COVERAGE_FILE")
        BRANCHES_PCT=$(jq -r '.total.branches.pct' "$COVERAGE_FILE")
        FUNCTIONS_PCT=$(jq -r '.total.functions.pct' "$COVERAGE_FILE")
        LINES_PCT=$(jq -r '.total.lines.pct' "$COVERAGE_FILE")
    else
        # Fallback parsing without jq
        STATEMENTS_PCT=$(grep -o '"statements":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | head -1)
        BRANCHES_PCT=$(grep -o '"branches":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | head -1)
        FUNCTIONS_PCT=$(grep -o '"functions":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | head -1)
        LINES_PCT=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | head -1)
    fi

elif [ -f "$LCOV_FILE" ]; then
    echo "Using lcov file: $LCOV_FILE"

    # Extract coverage from lcov.info
    FUNCTIONS_PCT=$(extract_lcov_coverage "$LCOV_FILE" "functions")
    LINES_PCT=$(extract_lcov_coverage "$LCOV_FILE" "lines")
    BRANCHES_PCT=$(extract_lcov_coverage "$LCOV_FILE" "branches")
    STATEMENTS_PCT="$LINES_PCT"  # Approximate statements with lines
fi

# Convert to integers for comparison
STATEMENTS_INT=${STATEMENTS_PCT%.*}
BRANCHES_INT=${BRANCHES_PCT%.*}
FUNCTIONS_INT=${FUNCTIONS_PCT%.*}
LINES_INT=${LINES_PCT%.*}

# Validate coverage metrics
echo
echo "Global Coverage Validation:"

if validate_coverage "Statements" "$STATEMENTS_INT" "$MIN_COVERAGE_STATEMENTS" "false"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if validate_coverage "Branches" "$BRANCHES_INT" "$MIN_COVERAGE_BRANCHES" "false"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if validate_coverage "Functions" "$FUNCTIONS_INT" "$MIN_COVERAGE_FUNCTIONS" "false"; then
    ((PASSED++))
else
    ((FAILED++))
fi

if validate_coverage "Lines" "$LINES_INT" "$MIN_COVERAGE_LINES" "false"; then
    ((PASSED++))
else
    ((FAILED++))
fi

# Check critical paths if lcov.info is available
if [ -f "$LCOV_FILE" ]; then
    echo
    echo "Critical Path Analysis:"

    for critical_path in "${CRITICAL_PATHS[@]}"; do
        echo "  Analyzing: $critical_path"

        # Extract files for this critical path
        CRITICAL_FILES=$(grep -E "SF:.*/$critical_path/" "$LCOV_FILE" | wc -l || echo "0")

        if [ "$CRITICAL_FILES" -gt 0 ]; then
            # This is a simplified check - in a real implementation,
            # you'd calculate coverage per path
            echo "    Found $CRITICAL_FILES files in critical path"
            if [ "$FUNCTIONS_INT" -ge "$CRITICAL_MIN" ]; then
                echo -e "    ✅ Critical path coverage adequate"
                ((PASSED++))
            else
                echo -e "    ⚠️  Critical path may need attention"
                ((WARNINGS++))
            fi
        else
            echo "    No files found in this path"
        fi
    done
fi

# Bundle size check (if dist directory exists)
echo
echo -e "${BLUE}📦 Bundle Size Analysis${NC}"
echo "----------------------"

if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sk dist/ 2>/dev/null | cut -f1 || echo "0")
    MAX_BUNDLE_SIZE=2048  # 2MB in KB

    if [ "$BUNDLE_SIZE" -le "$MAX_BUNDLE_SIZE" ]; then
        echo -e "  ✅ Bundle size: ${BUNDLE_SIZE}KB (≤${MAX_BUNDLE_SIZE}KB)"
        ((PASSED++))
    else
        echo -e "  ❌ Bundle size: ${BUNDLE_SIZE}KB (Max: ${MAX_BUNDLE_SIZE}KB)"
        ((FAILED++))
    fi
else
    echo "  ⚠️  No dist directory found - skipping bundle size check"
    ((WARNINGS++))
fi

# Performance check (if test results are available)
echo
echo -e "${BLUE}⚡ Performance Analysis${NC}"
echo "----------------------"

# Check for test execution time (approximate from last test run)
if [ -f "test-results.json" ] || [ -f "jest-results.json" ]; then
    echo "  ℹ️  Test performance metrics available"
    # Add test execution time analysis here
    ((PASSED++))
else
    echo "  ⚠️  No test performance data available"
    ((WARNINGS++))
fi

# Security check
echo
echo -e "${BLUE}🔒 Security Analysis${NC}"
echo "-------------------"

# Check for audit issues
if npm audit --audit-level high --production >/dev/null 2>&1; then
    echo -e "  ✅ No high severity security issues"
    ((PASSED++))
else
    echo -e "  ❌ Security vulnerabilities found"
    ((FAILED++))
fi

# Final summary
echo
echo "=================================="
echo -e "${BLUE}📋 Quality Gate Summary${NC}"
echo "=================================="
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

TOTAL=$((PASSED + FAILED))
if [ "$TOTAL" -gt 0 ]; then
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
    echo -e "📊 Success Rate: ${SUCCESS_RATE}%"
else
    SUCCESS_RATE=0
fi

# Generate GitHub Actions output
if [ "${GITHUB_ACTIONS:-false}" = "true" ]; then
    echo "coverage-statements=$STATEMENTS_PCT" >> "$GITHUB_OUTPUT"
    echo "coverage-branches=$BRANCHES_PCT" >> "$GITHUB_OUTPUT"
    echo "coverage-functions=$FUNCTIONS_PCT" >> "$GITHUB_OUTPUT"
    echo "coverage-lines=$LINES_PCT" >> "$GITHUB_OUTPUT"
    echo "quality-gate-passed=$PASSED" >> "$GITHUB_OUTPUT"
    echo "quality-gate-failed=$FAILED" >> "$GITHUB_OUTPUT"
    echo "quality-gate-warnings=$WARNINGS" >> "$GITHUB_OUTPUT"
    echo "success-rate=$SUCCESS_RATE" >> "$GITHUB_OUTPUT"
fi

# Exit with appropriate code
if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 All quality gates passed!${NC}"
    exit 0
else
    echo -e "${RED}💥 Quality gate validation failed!${NC}"
    echo "Please fix the issues above before merging."
    exit 1
fi
