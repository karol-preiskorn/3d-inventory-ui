---
name: Pull Request
about: Create a pull request for code review and CI/CD validation
title: '[Feature/Bugfix]: Brief description'
labels: ['needs-review']
assignees: ['karol-preiskorn']
---

## 📋 Pull Request Summary

### Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test coverage improvement
- [ ] 🔒 Security enhancement

### Description

<!-- Provide a clear and concise description of what this PR does -->

### Related Issues

- Fixes #(issue number)
- Related to #(issue number)

## 🧪 Testing Checklist

### Test Coverage Verification

- [ ] All new code is covered by tests
- [ ] Coverage meets minimum threshold (≥80%)
- [ ] No failing tests
- [ ] Added integration tests where applicable

### Local Testing Commands

```bash
# Run these commands locally before submitting PR
npm run test:fast              # Fast unit tests
npm run test:coverage          # Coverage analysis
npm run quality:gate          # Quality gate validation
npm run lint:check            # Linting validation
npm run build:prod            # Production build test
```

### Coverage Report

<!-- Paste coverage summary from `npm run test:coverage` -->

```
Coverage Summary:
- Statements: X%
- Branches: X%
- Functions: X%
- Lines: X%
```

## � Code Quality Checklist

### Linting & Formatting

- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] No console.log statements in production code
- [ ] TypeScript strict mode compliance

### Angular Best Practices

- [ ] Components use OnPush change detection where applicable
- [ ] Proper dependency injection implemented
- [ ] Services properly scoped (providedIn)
- [ ] Lifecycle hooks properly implemented
- [ ] Error handling implemented

### Performance & Security

- [ ] Bundle size impact analyzed
- [ ] No performance regressions introduced
- [ ] No security vulnerabilities introduced
- [ ] Input validation implemented where needed
- [ ] Authentication/authorization properly handled

## 🚀 CI/CD Pipeline Integration

### Automated Checks Status

<!-- These will be automatically updated by GitHub Actions -->

- [ ] ✅ Quality Gates Pass
- [ ] ✅ Test Suite Pass
- [ ] ✅ Build Validation (Dev & Prod)
- [ ] ✅ Coverage Analysis (≥80%)
- [ ] ✅ Security Analysis
- [ ] ✅ Performance Testing

## 📱 Manual Testing Instructions

### Setup

```bash
git checkout [branch-name]
npm install
npm run test:coverage  # Verify all tests pass
npm run build:prod     # Verify production build
```

### Testing Steps

1. [Describe testing steps]
2. [Expected behavior]
3. [Acceptance criteria]

## 📊 Quality Metrics

<!-- These will be populated by the CI/CD pipeline -->

| Metric        | Target | Actual | Status |
| ------------- | ------ | ------ | ------ |
| Coverage      | ≥80%   | X%     | ✅/❌  |
| Bundle Size   | ≤2MB   | X KB   | ✅/❌  |
| Build Time    | ≤5min  | X s    | ✅/❌  |
| Tests Passing | 100%   | X%     | ✅/❌  |

## 📸 Screenshots (if applicable)

Add screenshots to help explain your changes.

## 🎯 Definition of Done

- [ ] All automated CI/CD checks pass
- [ ] Code review completed and approved
- [ ] Test coverage threshold met (≥80%)
- [ ] No security vulnerabilities introduced
- [ ] Performance impact assessed
- [ ] Documentation updated where necessary
- [ ] Ready for deployment

## 👥 Reviewers

@karol-preiskorn

---

**🤖 CI/CD Pipeline Status will be updated automatically**
