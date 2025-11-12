# File Organization Maintenance Guide - Angular UI

This guide explains how to maintain proper file organization for the 3D Inventory Angular UI project.

## Quick Reference

### Root Directory (3 files only)

- `README.md` - Main project documentation
- `LICENSE` - Project license
- `AGENTS.md` - AI-assisted development patterns

### Scripts Directory Structure

```
scripts/
├── *.sh              # Build and deployment scripts
├── testing/          # Test utilities and test automation
│   ├── test-login-functionality.js
│   ├── test-api-structure.cjs
│   ├── extra-webpack.config.js
│   └── ... (other test utilities)
└── organize-ui-project.js  # File organization automation
```

### Config Directory

- `jest.config.ts` - Jest testing framework
- `jest.config.fast.ts` - Fast Jest configuration
- `eslint.config.js` - ESLint code quality rules
- `karma.conf.js` - Karma test runner configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.spec.json` - TypeScript test configuration

### Docs Directory Structure

```
docs/
├── guides/                # Setup and configuration guides
│   ├── FILE-ORGANIZATION-MAINTENANCE.md
│   ├── AUTHENTICATION-TESTS-QUICK-START.md
│   ├── USER-MANAGEMENT-ADMIN-GUIDE.md
│   └── ... (other guides)
├── features/              # Feature documentation
│   ├── AUTHENTICATION-SERVICE-TESTS-SUMMARY.md
│   ├── PERMISSIONS-MODAL-FEATURE.md
│   └── ... (other features)
├── troubleshooting/       # Troubleshooting and debugging
│   ├── 403-GITHUB-ISSUES-ERROR.md
│   ├── ADD-DEVICE-TEST-FIX.md
│   └── ... (bug fixes and issues)
└── archive/               # Historical and archived docs
    ├── ADMIN-ACCESS-FINAL-VERIFICATION.md
    └── ... (old documentation)
```

## Creating New Files - Decision Tree

```
START: Creating new file
│
├─ Shell script (.sh)?
│  └─ YES → /scripts/ ✅
│
├─ Test utility (.js, .cjs, .ts test file)?
│  └─ YES → /scripts/testing/ ✅
│
├─ Config file (jest, eslint, karma, tsconfig)?
│  └─ YES → /config/ ✅
│
├─ Documentation?
│  ├─ Feature documentation → /docs/features/ ✅
│  ├─ Setup or guide → /docs/guides/ ✅
│  ├─ Troubleshooting or bug fix → /docs/troubleshooting/ ✅
│  └─ Archive or historical → /docs/archive/ ✅
│
├─ Application source code?
│  ├─ Angular component → /src/app/components/ ✅
│  ├─ Angular service → /src/app/services/ ✅
│  ├─ Route guard → /src/app/guards/ ✅
│  ├─ Model or interface → /src/app/models/ ✅
│  ├─ Pipe or directive → /src/app/pipes/ ✅
│  └─ Utility function → /src/app/utils/ ✅
│
└─ Core project file (README, LICENSE, AGENTS)?
   └─ YES → /ROOT ✅
```

## Validation

### Check File Organization

Validate that all files are in correct locations:

```bash
npm run check:file-organization
```

This command validates:

- ✅ Root directory contains only 3 essential files
- ✅ Shell scripts in `/scripts/`
- ✅ Test utilities in `/scripts/testing/`
- ✅ Configuration files in `/config/`
- ✅ Documentation organized in `/docs/` subdirectories
- ✅ No test files or config files in root

### Validation Output

**Success:**

```
✅ VALIDATION PASSED - File organization is correct
```

**Failure:**

```
❌ VALIDATION FAILED - Critical errors found
   • Issue descriptions
   • Recommended fixes
```

## Common Scenarios

### Scenario 1: Creating a New Test File

**Task:** Create tests for a new Angular service

**Steps:**

1. Create test file: `/src/app/services/new-service.spec.ts`
   - Test files should be in the same directory as the service
   - Use `.spec.ts` suffix for Angular tests

2. If creating testing utility (not component test):
   - Create file: `/scripts/testing/test-new-utility.js`
   - Add to `package.json` scripts if needed

3. Run validation:
   ```bash
   npm run check:file-organization
   ```

### Scenario 2: Adding New Configuration

**Task:** Add a new Jest configuration for integration tests

**Steps:**

1. Create file: `/config/jest.config.integration.ts`

2. If referencing from `package.json`:

   ```json
   "test:integration": "jest --config=config/jest.config.integration.ts"
   ```

3. Run validation:
   ```bash
   npm run check:file-organization
   ```

### Scenario 3: Creating Feature Documentation

**Task:** Document new authentication features

**Steps:**

1. Create file: `/docs/features/NEW-FEATURE-DOCUMENTATION.md`

2. Link from related components if needed

3. Update any index or navigation files

4. Run validation:
   ```bash
   npm run check:file-organization
   ```

### Scenario 4: Moving Troubleshooting Documentation

**Task:** Organize bug fix documentation

**Steps:**

1. Files with ERROR, FIX, BUG, ISSUE, PROBLEM in name
   → `/docs/troubleshooting/`

2. Historical or no-longer-relevant docs
   → `/docs/archive/`

3. Run validation:
   ```bash
   npm run check:file-organization
   ```

## Maintenance Tasks

### Weekly: Check File Organization

```bash
# Validate file organization
npm run check:file-organization

# Check root for unexpected files
ls -la | grep -E "\.(js|ts|sh|json)$"
```

### Before Each Commit

File organization is automatically checked via Husky hooks (if configured).

### Before Each Push

```bash
# Full quality validation including file organization
npm run check:file-organization
npm run test
npm run lint
```

## Troubleshooting

### Issue: Validation fails with "Executable files found in root"

**Cause:** Test or config files were created in root instead of subdirectories

**Solution:**

1. Identify problematic files:

   ```bash
   ls -la | grep -E "\.(js|cjs|sh|ts)$"
   ```

2. Move to appropriate location:

   ```bash
   mv /filename.js scripts/testing/
   mv /jest.config.ts config/
   ```

3. Update `package.json` script paths if needed

4. Verify: `npm run check:file-organization`

### Issue: Test can't find configuration after moving file

**Cause:** `angular.json` or `package.json` references old file location

**Solution:**

1. Update `package.json` scripts:

   ```json
   // OLD
   "test": "jest --config=jest.config.ts"

   // NEW
   "test": "jest --config=config/jest.config.ts"
   ```

2. Update `angular.json` if test configuration references old location

3. Test: `npm run test`

### Issue: Can't find documentation after moving

**Cause:** Links or references point to old location

**Solution:**

1. Update all links in documentation files

2. Update `README.md` table of contents if applicable

3. Search for old path:

   ```bash
   grep -r "old-path" docs/
   grep -r "old-filename" src/
   ```

4. Update all references

## Quick Organization Commands

### Analyze Current State

```bash
# Count files in different locations
echo "Root files:"
ls -1 | wc -l
echo "Scripts:"
find scripts -type f | wc -l
echo "Config:"
find config -type f | wc -l
echo "Docs:"
find docs -type f | wc -l
```

### Find Files by Type

```bash
# Find all test files not in proper location
find . -name "*.spec.ts" -not -path "./src/*" -not -path "./node_modules/*"

# Find config files not in /config/
find . -name "jest.config.*" -not -path "./config/*" -not -path "./node_modules/*"

# Find markdown files in root
ls -la *.md
```

### Move Multiple Files

```bash
# Move all .sh files to scripts/
mv *.sh scripts/

# Move all jest configs to config/
mv jest.config.* config/

# Move test files (careful - check first!)
# find . -name "test-*.js" -type f -exec mv {} scripts/testing/ \;
```

## CI/CD Integration

File organization is validated automatically:

### Pre-commit Hook (if configured with Husky)

```bash
npm run check:file-organization
```

### GitHub Actions

Validation runs on:

- Push to main branch
- Pull requests

If validation fails, the check fails and must be fixed before merging.

## CLI Reference

```bash
# Validate file organization
npm run check:file-organization

# Organize files automatically (if available)
npm run organize:run

# Combined: organize then validate
npm run organize:verify

# Check specific directories
ls -la scripts/
ls -la config/
ls -la docs/

# Find and move files
find . -name "*.sh" -type f
mv filename.sh scripts/
```

## FAQ

### Q: Can I keep some files in root?

**A:** Only 3 files: README.md, LICENSE, and AGENTS.md. All others must be in subdirectories.

### Q: What if a file type isn't covered?

**A:** Use priority order:

1. Related to testing? → `/scripts/testing/`
2. Build/deployment script? → `/scripts/`
3. Configuration? → `/config/`
4. Documentation? → `/docs/archive/`
5. Ask the team

### Q: Can I create new documentation subdirectories?

**A:** Only use the 4 established subdirectories:

- `/docs/features/`
- `/docs/guides/`
- `/docs/troubleshooting/`
- `/docs/archive/`

If a document doesn't fit, discuss with the team.

### Q: How do I bypass validation?

**A:** Don't, but if absolutely necessary:

```bash
git commit --no-verify
# or
git -c core.hooksPath=/dev/null commit
```

**Warning:** Bypassing corrupts project organization and confuses team members.

## Related Documentation

- [.github/instructions/file-organization.instructions.md](../../.github/instructions/file-organization.instructions.md) - Copilot file organization rules
- [README.md](../../README.md) - Project overview
- [AGENTS.md](../../AGENTS.md) - AI-assisted development patterns

---

**Version:** 1.0
**Last Updated:** November 12, 2025
**Applies To:** 3D Inventory Angular UI
