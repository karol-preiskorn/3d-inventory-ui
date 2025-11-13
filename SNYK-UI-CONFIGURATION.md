# Snyk Configuration - 3D Inventory Angular UI

**Project**: 3d-inventory-angular-ui
**Date**: November 12, 2025
**Status**: ✅ Ready to Use

---

## 📋 Overview

Snyk is configured to automatically **exclude unnecessary folders** from security scanning to provide:

- ✅ **Faster scans** - Skip non-code paths
- ✅ **Fewer false positives** - Don't scan documentation
- ✅ **Clean reports** - Focus on actual security issues
- ✅ **CI/CD optimized** - Efficient pipeline integration

---

## 🚀 Quick Start

### 1. Install Snyk (if needed)

```bash
npm install -g snyk
```

### 2. Authenticate with Snyk

```bash
npm run snyk:auth
```

### 3. Run Security Scan

```bash
# Scan excluding docs and unnecessary folders
npm run snyk:test:exclude-docs

# Or full scan
npm run snyk:test
```

### 4. Monitor Vulnerabilities

```bash
npm run snyk:monitor
```

---

## 📂 Excluded Folders

The `.snyk` configuration file automatically excludes:

### Documentation & Markdown

```
docs/**           # Documentation folder
**/*.md           # All markdown files
```

### Build Artifacts

```
dist/**           # Production build output
build/**          # Build artifacts
out-tsc/**        # TypeScript compilation output
coverage/**       # Test coverage reports
```

### Dependencies

```
node_modules/**   # npm dependencies (handled by package.json)
```

### Angular-Specific

```
.angular/**       # Angular CLI cache
src/test-setup.ts # Test setup file
```

### Test Files

```
**/*.spec.ts           # Angular spec tests
**/*.test.ts           # Jest tests
src/app/testing/**     # Testing utilities
src/app/tests/**       # Test suite folder
```

### Archives & Backups

```
backups/**           # Backup files
**/*backup*          # Backup patterns
**/*BACKUP*          # Uppercase backups
**/*archive*         # Archive patterns
**/*ARCHIVE*         # Uppercase archives
```

### IDE & Cache

```
.cache/**       # Cache folders
**/.DS_Store    # macOS files
.idea/**        # JetBrains IDE
.vscode/**      # VSCode settings
```

---

## 📊 npm Scripts Available

### Available Commands

```bash
# Basic scanning
npm run snyk:test                 # Full security scan
npm run snyk:test:exclude-docs    # Scan excluding docs (recommended)

# Monitoring & Authentication
npm run snyk:auth                 # Authenticate with Snyk
npm run snyk:monitor              # Monitor for vulnerabilities

# Advanced Scanning
npm run snyk:code                 # Code quality scanning (SAST)
npm run snyk:iac                  # Infrastructure as Code scanning
npm run security:check            # Traditional npm audit
```

---

## 🔧 Configuration File

### File Location

`./.snyk` in project root

### Key Sections

**Version**

```yaml
version: v1.25.0
```

**Global Exclusions**

```yaml
exclude:
  global:
    - docs/**
    - dist/**
    - build/**
    # ... more patterns
```

**Ignore Vulnerabilities (Optional)**

```yaml
ignore:
  SNYK-JS-VULN-ID:
    - '**/node_modules/package-name'
    - reason: 'Description'
    - expires: '2025-12-31'
```

---

## ✨ Use Cases

### Development

```bash
# Quick test while developing
npm run snyk:test:exclude-docs
```

### Pre-Commit

```bash
# Add to your pre-commit hook
npm run security:check && npm run snyk:test:exclude-docs
```

### CI/CD Pipeline

```bash
# In GitHub Actions or other CI
npm run snyk:test:exclude-docs
npm run snyk:monitor
```

### Code Review

```bash
# Check specific pull request
npm run snyk:code  # SAST scanning
```

---

## 🔍 Verification

### Check Configuration

```bash
# View current Snyk config
snyk config view

# Verify .snyk file exists
ls -la .snyk

# Test configuration (dry-run)
snyk test --dry-run
```

### List Excluded Patterns

```bash
# Show all exclude patterns
grep -A 50 "exclude:" .snyk
```

---

## 📚 Integration Examples

### GitHub Actions (Workflow)

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Snyk Security Scan
        run: npm run snyk:test:exclude-docs

      - name: Snyk Monitor
        run: npm run snyk:monitor
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Quality Gate Integration

```bash
# Add to quality:full script
npm run lint:check && \
npm run test:ci && \
npm run snyk:test:exclude-docs && \
npm run quality:gate
```

---

## 🛡️ Security Best Practices

### ✅ DO

- [x] Exclude documentation folders
- [x] Exclude build artifacts
- [x] Exclude test files
- [x] Use `.snyk` file for consistency
- [x] Monitor continuously
- [x] Review vulnerabilities regularly
- [x] Use `snyk:test:exclude-docs` in CI/CD

### ❌ DON'T

- [ ] Scan node_modules directly (handled automatically)
- [ ] Ignore all vulnerabilities
- [ ] Skip authentication
- [ ] Exclude source code from scanning
- [ ] Leave default vulnerabilities unreviewed
- [ ] Store Snyk token in version control
- [ ] Scan markdown files for vulnerabilities

---

## 📞 Troubleshooting

### Problem: "snyk: command not found"

**Solution**:

```bash
npm install -g snyk
# or use with npx
npx snyk test
```

### Problem: "Authentication required"

**Solution**:

```bash
npm run snyk:auth
```

### Problem: "Unexpected end of JSON"

**Solution**:

```bash
# Delete and recreate .snyk file
rm .snyk
# Use CLI flags instead
snyk test --exclude=docs
```

### Problem: Slow scan

**Solution**:

- Verify `.snyk` file has proper exclusions
- Check that `node_modules` is excluded
- Clear cache: `snyk config clear`

### Problem: False positives in documentation

**Solution**:

- Verify `docs/**` and `**/*.md` are in excludes
- Run: `npm run snyk:test:exclude-docs`

---

## 📊 Excluded Patterns Summary

| Pattern                    | Purpose             | Impact                  |
| -------------------------- | ------------------- | ----------------------- |
| `docs/**`                  | Skip documentation  | Faster scans            |
| `**/*.md`                  | Skip markdown files | Fewer false positives   |
| `dist/**`, `build/**`      | Skip build outputs  | Cleaner results         |
| `coverage/**`              | Skip test reports   | Faster scanning         |
| `node_modules/**`          | Skip dependencies   | Handled by package.json |
| `**/*.spec.ts`             | Skip tests          | Focus on source code    |
| `.angular/**`, `.cache/**` | Skip cache          | Faster execution        |

---

## 🔗 Related Files

| File                                | Purpose                           |
| ----------------------------------- | --------------------------------- |
| `.snyk`                             | Snyk configuration (policy file)  |
| `package.json`                      | npm scripts for Snyk commands     |
| `docs/guides/SNYK-CONFIGURATION.md` | Comprehensive configuration guide |
| `SNYK-QUICK-START.md`               | Quick reference guide             |

---

## ✅ Setup Checklist

- [x] `.snyk` file created and configured
- [x] Unnecessary folders excluded
- [x] 7 npm scripts added to package.json
- [x] Documentation created
- [x] Ready for immediate use

---

## 🎯 Next Steps

1. **Test the configuration**:

   ```bash
   npm run snyk:test:exclude-docs
   ```

2. **Authenticate for monitoring**:

   ```bash
   npm run snyk:auth
   npm run snyk:monitor
   ```

3. **Integrate into CI/CD**:
   - Add to GitHub Actions workflows
   - Use `npm run snyk:test:exclude-docs` in pipeline

4. **Monitor vulnerabilities**:
   - Use Snyk dashboard for tracking
   - Review and fix issues regularly

---

## 📞 Support

For more information:

- **Snyk Documentation**: <https://docs.snyk.io>
- **Angular Best Practices**: <https://angular.io/guide/security>
- **Local Guide**: See `docs/guides/SNYK-CONFIGURATION.md`

---

**Status**: ✅ **Configuration Complete**

Ready to use! Run `npm run snyk:test:exclude-docs` anytime.
