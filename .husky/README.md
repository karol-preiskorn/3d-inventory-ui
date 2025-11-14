# 🪝 Husky Git Hooks - Configuration Guide

## Overview

This project uses **Husky** to enforce code quality and security standards through automated Git hooks. All commits and pushes are validated before they reach the repository.

## 🎯 Git Hooks Configured

### 1. **pre-commit** - Code Quality & Security Gates

**Runs on**: Every `git commit`

**Checks Performed**:
1. 🔒 **Security Scan**
   - Detects hardcoded passwords, API keys, and tokens
   - Excludes test files and legitimate form controls
   - Prevents accidental secret commits

2. 🧹 **Auto-Formatting**
   - Prettier formatting for TypeScript/JavaScript/HTML
   - ESLint auto-fix for fixable issues
   - Automatic code style consistency

3. 📝 **TypeScript Type Check**
   - Full TypeScript compilation validation
   - Ensures no type errors before commit
   - Strict mode enforcement

4. 🔍 **Strict ESLint Validation**
   - Zero errors allowed
   - Zero warnings allowed (--max-warnings 0)
   - Comprehensive code quality check

5. 🔒 **Angular Template Security**
   - Detects unsafe [innerHTML] usage
   - Warns about bypassSecurityTrust
   - Ensures XSS protection

6. 🔢 **Version Bump**
   - Automatic minor version increment
   - Updates package.json version
   - Maintains version history

**Exit Codes**:
- `0` - All checks passed, commit proceeds
- `1` - Checks failed, commit blocked

---

### 2. **pre-push** - Comprehensive Quality Gates

**Runs on**: Every `git push`

**Checks Performed**:
1. 🔍 **Full Lint Validation**
   - Complete codebase linting
   - No errors or warnings allowed
   - Strict quality enforcement

2. 📝 **TypeScript Compilation**
   - Full project type checking
   - Ensures production build compatibility
   - Strict mode compliance

3. 🧪 **Complete Test Suite**
   - All unit tests must pass
   - Integration tests validation
   - CI-compatible test execution

4. 📊 **Test Coverage Verification**
   - Checks coverage meets ≥80% threshold
   - Warns if coverage is low
   - Generates coverage report

5. 🔒 **Security Audit**
   - npm audit for production dependencies
   - Detects high-severity vulnerabilities
   - Non-blocking warnings for awareness

6. 🏗️ **Production Build** (main branch only)
   - Verifies production build succeeds
   - Ensures deployability
   - Catches build-time errors

7. 🔍 **Merge Conflict Check**
   - Detects unresolved merge markers
   - Prevents pushing conflicted code

**Performance**:
- Fast feedback for most checks
- Full test suite runs in background
- Parallel execution where possible

---

### 3. **commit-msg** - Conventional Commit Format

**Runs on**: Every `git commit`

**Validation**:
- Enforces [Conventional Commits](https://www.conventionalcommits.org/) format
- Format: `type(scope): description`
- Improves changelog generation and release automation

**Valid Types**:
| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat: add user authentication` |
| `fix` | Bug fix | `fix(auth): resolve token expiration` |
| `docs` | Documentation | `docs: update README` |
| `style` | Code formatting | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor(services): optimize API calls` |
| `perf` | Performance improvement | `perf: reduce bundle size` |
| `test` | Add/update tests | `test(auth): add login tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `build` | Build system | `build: configure webpack` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |
| `revert` | Revert commit | `revert: undo feature X` |

**Examples**:
```bash
✅ feat: add device management component
✅ fix(api): resolve CORS issue with backend
✅ docs: update authentication guide
✅ refactor(models): improve User interface
✅ test(services): add comprehensive auth tests

❌ Added new feature
❌ Fixed bug
❌ Updated code
```

**Scope** (optional but recommended):
- Helps identify affected area
- Examples: `(auth)`, `(api)`, `(ui)`, `(models)`, `(services)`

---

## 🚀 Quick Start

### Installation

Husky is already configured! When you run `npm install`, hooks are automatically set up.

```bash
# Install dependencies (sets up hooks automatically)
npm install

# Verify hooks are installed
ls -la .husky/
```

### Testing Hooks Locally

#### Test pre-commit:
```bash
# Make some changes
echo "test" >> test-file.txt
git add test-file.txt

# Try to commit (hooks will run)
git commit -m "test: verify hooks"
```

#### Test pre-push:
```bash
# Push to test pre-push hook
git push origin feature-branch
```

#### Test commit-msg:
```bash
# Try invalid commit message
git commit -m "this will fail"

# Try valid commit message
git commit -m "feat: this will work"
```

---

## 🔧 Configuration

### Disable Hooks Temporarily (Not Recommended)

For emergency situations only:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

⚠️ **Warning**: Skipping hooks bypasses quality gates. Use sparingly!

---

### Customize Hook Behavior

Edit hook files directly:

```bash
# Edit pre-commit hook
nano .husky/pre-commit

# Edit pre-push hook
nano .husky/pre-push

# Edit commit-msg hook
nano .husky/commit-msg
```

After editing, make sure hooks remain executable:
```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

---

## 📊 Workflow Examples

### Standard Development Workflow

```bash
# 1. Create feature branch
git checkout -b feat/user-profile

# 2. Make changes
# ... edit files ...

# 3. Stage changes
git add src/app/components/user-profile.component.ts

# 4. Commit with conventional format
# pre-commit hook runs: security, lint, TypeScript, tests
# commit-msg hook runs: validates commit message format
git commit -m "feat(user): add user profile component"

# 5. Push to remote
# pre-push hook runs: full tests, coverage, build
git push origin feat/user-profile
```

### Fixing Hook Failures

```bash
# Pre-commit failed on ESLint
# 1. Check errors
npm run lint

# 2. Auto-fix if possible
npm run lint:fix

# 3. Manual fixes for remaining issues
# ... edit files ...

# 4. Try commit again
git commit -m "fix(lint): resolve ESLint errors"

# Pre-push failed on tests
# 1. Run tests locally
npm test

# 2. Fix failing tests
# ... edit test files ...

# 3. Verify tests pass
npm run test:ci

# 4. Try push again
git push
```

---

## 🎯 Best Practices

### 1. **Run Checks Before Committing**

```bash
# Check what will run in pre-commit
npm run lint:check
npx tsc --noEmit
npm test
```

### 2. **Use Conventional Commit Format**

```bash
# Good commit messages
git commit -m "feat(auth): implement JWT authentication"
git commit -m "fix(api): resolve CORS configuration"
git commit -m "docs: update installation guide"

# Bad commit messages (will be rejected)
git commit -m "Updated code"
git commit -m "Fixed stuff"
git commit -m "WIP"
```

### 3. **Review Auto-Formatted Code**

Pre-commit hook auto-formats code. Review changes:
```bash
git diff --cached
```

### 4. **Resolve Security Warnings**

If pre-commit detects potential secrets:
```bash
# Use environment variables
# ❌ const API_KEY = 'sk_live_1234567890'
# ✅ const API_KEY = environment.apiKey
```

---

## 🔍 Troubleshooting

### Hook Not Running

```bash
# Reinstall hooks
npx husky install

# Verify hook permissions
ls -la .husky/
# Should see: -rwxr-xr-x (executable)

# Make executable if needed
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

### Hook Runs But Fails

```bash
# Check hook output for specific errors
# Example: ESLint errors
npm run lint

# Example: TypeScript errors
npx tsc --noEmit

# Example: Test failures
npm test
```

### Bypass Hook for Emergency

```bash
# Only for critical production fixes
git commit --no-verify -m "hotfix: critical security patch"
git push --no-verify
```

---

## 📚 Related Documentation

- **[AGENTS.md](../AGENTS.md)** - AI-assisted development workflow
- **[code_quality_standards.instructions.md](../.github/instructions/code_quality_standards.instructions.md)** - Code quality requirements
- **[test_coverage_standards.instructions.md](../.github/instructions/test_coverage_standards.instructions.md)** - Testing standards
- **[snyk_rules.instructions.md](../.github/instructions/snyk_rules.instructions.md)** - Security guidelines

---

## 🆘 Support

If you encounter issues with Git hooks:

1. Check hook output for specific error messages
2. Run individual checks manually (lint, test, build)
3. Review this documentation
4. Check GitHub Actions workflow for similar checks

---

**Last Updated**: November 14, 2025
**Husky Version**: 9.x
**Project**: 3d-inventory-angular-ui
