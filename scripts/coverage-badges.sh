#!/bin/bash

# Coverage Badge Generation Script
# Generates coverage badges for GitHub README

set -euo pipefail

# Configuration
COVERAGE_FILE="coverage/coverage-summary.json"
BADGES_DIR="coverage/badges"
README_FILE="README.md"

# Colors for different coverage levels
COLOR_EXCELLENT="#4c1"      # 90%+
COLOR_GOOD="#97ca00"        # 80-89%
COLOR_FAIR="#dfb317"        # 70-79%
COLOR_POOR="#fe7d37"        # 60-69%
COLOR_CRITICAL="#e05d44"    # <60%

# Create badges directory
mkdir -p "$BADGES_DIR"

echo "🎨 Generating coverage badges..."

# Function to get color based on coverage percentage
get_coverage_color() {
    local coverage=$1

    if [ "$coverage" -ge 90 ]; then
        echo "$COLOR_EXCELLENT"
    elif [ "$coverage" -ge 80 ]; then
        echo "$COLOR_GOOD"
    elif [ "$coverage" -ge 70 ]; then
        echo "$COLOR_FAIR"
    elif [ "$coverage" -ge 60 ]; then
        echo "$COLOR_POOR"
    else
        echo "$COLOR_CRITICAL"
    fi
}

# Function to generate shield.io badge URL
generate_badge_url() {
    local label=$1
    local value=$2
    local color=$3

    echo "https://img.shields.io/badge/${label}-${value}%25-${color:1}?style=flat-square"
}

# Check if coverage file exists
if [ ! -f "$COVERAGE_FILE" ]; then
    echo "❌ Coverage file not found: $COVERAGE_FILE"
    echo "Run 'npm run test:coverage' first"
    exit 1
fi

# Extract coverage metrics
if command -v jq >/dev/null 2>&1; then
    STATEMENTS=$(jq -r '.total.statements.pct' "$COVERAGE_FILE" | cut -d. -f1)
    BRANCHES=$(jq -r '.total.branches.pct' "$COVERAGE_FILE" | cut -d. -f1)
    FUNCTIONS=$(jq -r '.total.functions.pct' "$COVERAGE_FILE" | cut -d. -f1)
    LINES=$(jq -r '.total.lines.pct' "$COVERAGE_FILE" | cut -d. -f1)
else
    # Fallback parsing without jq
    STATEMENTS=$(grep -o '"statements":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | cut -d. -f1 | head -1)
    BRANCHES=$(grep -o '"branches":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | cut -d. -f1 | head -1)
    FUNCTIONS=$(grep -o '"functions":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | cut -d. -f1 | head -1)
    LINES=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*,"skipped":[0-9]*,"pct":[0-9.]*' "$COVERAGE_FILE" | grep -o 'pct":[0-9.]*' | cut -d: -f2 | cut -d. -f1 | head -1)
fi

# Calculate overall coverage (weighted average)
OVERALL=$(( (STATEMENTS * 30 + BRANCHES * 20 + FUNCTIONS * 30 + LINES * 20) / 100 ))

# Generate badge URLs
OVERALL_COLOR=$(get_coverage_color "$OVERALL")
STATEMENTS_COLOR=$(get_coverage_color "$STATEMENTS")
BRANCHES_COLOR=$(get_coverage_color "$BRANCHES")
FUNCTIONS_COLOR=$(get_coverage_color "$FUNCTIONS")
LINES_COLOR=$(get_coverage_color "$LINES")

OVERALL_BADGE=$(generate_badge_url "Coverage" "$OVERALL" "$OVERALL_COLOR")
STATEMENTS_BADGE=$(generate_badge_url "Statements" "$STATEMENTS" "$STATEMENTS_COLOR")
BRANCHES_BADGE=$(generate_badge_url "Branches" "$BRANCHES" "$BRANCHES_COLOR")
FUNCTIONS_BADGE=$(generate_badge_url "Functions" "$FUNCTIONS" "$FUNCTIONS_COLOR")
LINES_BADGE=$(generate_badge_url "Lines" "$LINES" "$LINES_COLOR")

# Generate JSON file with badge information
cat > "$BADGES_DIR/coverage-badges.json" << EOF
{
  "overall": {
    "percentage": $OVERALL,
    "color": "$OVERALL_COLOR",
    "url": "$OVERALL_BADGE"
  },
  "statements": {
    "percentage": $STATEMENTS,
    "color": "$STATEMENTS_COLOR",
    "url": "$STATEMENTS_BADGE"
  },
  "branches": {
    "percentage": $BRANCHES,
    "color": "$BRANCHES_COLOR",
    "url": "$BRANCHES_BADGE"
  },
  "functions": {
    "percentage": $FUNCTIONS,
    "color": "$FUNCTIONS_COLOR",
    "url": "$FUNCTIONS_BADGE"
  },
  "lines": {
    "percentage": $LINES,
    "color": "$LINES_COLOR",
    "url": "$LINES_BADGE"
  }
}
EOF

# Generate markdown file with badges
cat > "$BADGES_DIR/coverage-badges.md" << EOF
# Test Coverage Badges

[![Coverage](${OVERALL_BADGE})](https://github.com/username/3d-inventory-ui/actions)
[![Statements](${STATEMENTS_BADGE})](https://github.com/username/3d-inventory-ui/actions)
[![Branches](${BRANCHES_BADGE})](https://github.com/username/3d-inventory-ui/actions)
[![Functions](${FUNCTIONS_BADGE})](https://github.com/username/3d-inventory-ui/actions)
[![Lines](${LINES_BADGE})](https://github.com/username/3d-inventory-ui/actions)

## Coverage Details

| Metric | Coverage | Status |
|--------|----------|--------|
| Overall | ${OVERALL}% | $([ "$OVERALL" -ge 80 ] && echo "✅ Good" || echo "❌ Needs Improvement") |
| Statements | ${STATEMENTS}% | $([ "$STATEMENTS" -ge 80 ] && echo "✅ Good" || echo "❌ Needs Improvement") |
| Branches | ${BRANCHES}% | $([ "$BRANCHES" -ge 75 ] && echo "✅ Good" || echo "❌ Needs Improvement") |
| Functions | ${FUNCTIONS}% | $([ "$FUNCTIONS" -ge 85 ] && echo "✅ Good" || echo "❌ Needs Improvement") |
| Lines | ${LINES}% | $([ "$LINES" -ge 80 ] && echo "✅ Good" || echo "❌ Needs Improvement") |

*Last updated: $(date)*
EOF

# Generate HTML badges for GitHub Pages
cat > "$BADGES_DIR/coverage-badges.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Coverage Badges</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .badge-container { margin: 10px 0; }
        .badge { margin-right: 10px; }
    </style>
</head>
<body>
    <h1>Test Coverage Badges</h1>

    <div class="badge-container">
        <img src="${OVERALL_BADGE}" alt="Overall Coverage" class="badge">
        <img src="${STATEMENTS_BADGE}" alt="Statements Coverage" class="badge">
        <img src="${BRANCHES_BADGE}" alt="Branches Coverage" class="badge">
        <img src="${FUNCTIONS_BADGE}" alt="Functions Coverage" class="badge">
        <img src="${LINES_BADGE}" alt="Lines Coverage" class="badge">
    </div>

    <h2>Coverage Details</h2>
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Metric</th>
            <th>Coverage</th>
            <th>Status</th>
        </tr>
        <tr>
            <td>Overall</td>
            <td>${OVERALL}%</td>
            <td>$([ "$OVERALL" -ge 80 ] && echo "✅ Good" || echo "❌ Needs Improvement")</td>
        </tr>
        <tr>
            <td>Statements</td>
            <td>${STATEMENTS}%</td>
            <td>$([ "$STATEMENTS" -ge 80 ] && echo "✅ Good" || echo "❌ Needs Improvement")</td>
        </tr>
        <tr>
            <td>Branches</td>
            <td>${BRANCHES}%</td>
            <td>$([ "$BRANCHES" -ge 75 ] && echo "✅ Good" || echo "❌ Needs Improvement")</td>
        </tr>
        <tr>
            <td>Functions</td>
            <td>${FUNCTIONS}%</td>
            <td>$([ "$FUNCTIONS" -ge 85 ] && echo "✅ Good" || echo "❌ Needs Improvement")</td>
        </tr>
        <tr>
            <td>Lines</td>
            <td>${LINES}%</td>
            <td>$([ "$LINES" -ge 80 ] && echo "✅ Good" || echo "❌ Needs Improvement")</td>
        </tr>
    </table>

    <p><em>Last updated: $(date)</em></p>
</body>
</html>
EOF

echo "✅ Coverage badges generated successfully!"
echo "Files created:"
echo "  - $BADGES_DIR/coverage-badges.json"
echo "  - $BADGES_DIR/coverage-badges.md"
echo "  - $BADGES_DIR/coverage-badges.html"
echo ""
echo "📊 Coverage Summary:"
echo "  Overall: ${OVERALL}%"
echo "  Statements: ${STATEMENTS}%"
echo "  Branches: ${BRANCHES}%"
echo "  Functions: ${FUNCTIONS}%"
echo "  Lines: ${LINES}%"

# Output for GitHub Actions
if [ "${GITHUB_ACTIONS:-false}" = "true" ]; then
    echo "coverage-overall=$OVERALL" >> "$GITHUB_OUTPUT"
    echo "coverage-statements=$STATEMENTS" >> "$GITHUB_OUTPUT"
    echo "coverage-branches=$BRANCHES" >> "$GITHUB_OUTPUT"
    echo "coverage-functions=$FUNCTIONS" >> "$GITHUB_OUTPUT"
    echo "coverage-lines=$LINES" >> "$GITHUB_OUTPUT"
    echo "badge-overall-url=$OVERALL_BADGE" >> "$GITHUB_OUTPUT"
fi
