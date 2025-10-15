# GitHub Copilot Instructions - 3D Inventory Angular UI

> **📚 For comprehensive AI agents and development automation documentation, see [AGENTS.md](../AGENTS.md)**

This document provides Angular-specific instructions for GitHub Copilot when working on the **3D Inventory Angular UI** project.

## 🔗 Related Documentation

Before proceeding, familiarize yourself with:
- **[AGENTS.md](../AGENTS.md)** - Complete guide to AI-assisted development workflows, testing automation, and code quality standards
- **[.github/instructions/](./instructions/)** - Fine-grained instruction files for specific aspects:
  - `code_quality_standards.instructions.md` - Code quality standards for Angular UI
  - `snyk_rules.instructions.md` - Security scanning requirements
  - `test_coverage_standards.instructions.md` - Angular-specific test coverage standards
  - `typescript_strict_mode.instructions.md` - TypeScript strict mode configuration

## Project Overview

### Architecture
- **Frontend Framework**: Angular 17+ with standalone components
- **Language**: TypeScript (strict mode)
- **3D Rendering**: Three.js for interactive 3D visualization
- **State Management**: BehaviorSubject-based reactive patterns with RxJS
- **Forms**: Reactive Forms with custom validators
- **Styling**: Bootstrap 5.3+ with custom SCSS
- **HTTP Client**: Angular HttpClient with typed responses
- **Testing**: Jest with Angular TestBed
- **Build**: Angular CLI with production optimization

### Key Dependencies
```json
{
  "@angular/core": "Angular 17+ framework",
  "@angular/common": "Common Angular utilities",
  "@angular/forms": "Reactive forms module",
  "@angular/router": "Angular routing",
  "rxjs": "Reactive programming with observables",
  "three": "3D graphics library",
  "bootstrap": "UI framework",
  "jest": "Testing framework"
}
```

## Quick Reference - Use AGENTS.md

**When you need information about:**

| Topic | Reference |
|-------|-----------|
| 🤖 **AI-Assisted Development** | [AGENTS.md](../AGENTS.md) - GitHub Copilot Integration |
| 🧪 **Testing Strategies** | [AGENTS.md](../AGENTS.md) - Testing Automation |
| 📊 **Code Quality** | [AGENTS.md](../AGENTS.md) - Code Analysis & Optimization |
| 🚀 **Deployment** | [AGENTS.md](../AGENTS.md) - Deployment Automation |
| 📚 **Documentation** | [AGENTS.md](../AGENTS.md) - Documentation Generation |
| 🔍 **Monitoring** | [AGENTS.md](../AGENTS.md) - Monitoring & User Analytics |

## Angular-Specific Patterns

For detailed Angular patterns and examples, refer to:
- **Component Architecture**: See AGENTS.md "AI-Assisted Angular Development" section
- **Service Layer**: See AGENTS.md "Service Integration" section
- **Testing**: See AGENTS.md "Testing Automation" section
- **Forms**: See AGENTS.md "Form Development" section

## 🧪 Testing Examples & References

### Comprehensive Test Suites Available

The project includes production-ready test examples:

- **[authentication.service.spec.ts](../src/app/services/authentication.service.spec.ts)** - Comprehensive service testing
  - 50+ test cases across 10 categories
  - Covers login, logout, token validation, permissions, edge cases
  - RBAC (Role-Based Access Control) testing
  - Security scenario testing
  - See **[AUTHENTICATION-SERVICE-TESTS-SUMMARY.md](../AUTHENTICATION-SERVICE-TESTS-SUMMARY.md)** for detailed documentation

### Using Test Examples

When generating new tests, reference existing patterns:

```typescript
// Example: Following authentication service test patterns
"Using the test patterns from authentication.service.spec.ts,
generate comprehensive tests for DeviceService with:
- Happy path scenarios
- Error handling
- Edge cases
- Security scenarios
Apply #test_coverage_standards"
```

### Test Documentation

- **[AUTHENTICATION-SERVICE-TESTS-SUMMARY.md](../AUTHENTICATION-SERVICE-TESTS-SUMMARY.md)** - Complete test documentation with 50+ test cases
- **[AUTHENTICATION-TESTS-QUICK-START.md](../AUTHENTICATION-TESTS-QUICK-START.md)** - Quick reference and run commands
- **Test Utilities**: Helper functions for creating mock tokens, users, and test data

## Code Quality Standards

All code must adhere to the standards defined in:
- ✅ **[code_quality_standards.instructions.md](./instructions/code_quality_standards.instructions.md)**
- ✅ **[test_coverage_standards.instructions.md](./instructions/test_coverage_standards.instructions.md)**
- ✅ **[typescript_strict_mode.instructions.md](./instructions/typescript_strict_mode.instructions.md)**

## Security Requirements

All security measures must follow:
- 🛡️ **[snyk_rules.instructions.md](./instructions/snyk_rules.instructions.md)**

## Development Workflow

The complete development workflow, including AI assistance integration, is documented in **[AGENTS.md](../AGENTS.md)**.

Key practices:
1. **Use AGENTS.md** as the primary reference for development patterns
2. **Reference instruction files** using hashtags (e.g., #code_quality_standards)
3. **Follow Angular style guide** for component and service structure
4. **Maintain test coverage** above 80% threshold
5. **Use TypeScript strict mode** for all code

## Current Project State

- **Production URL**: https://d-inventory-ui-wzwe3odv7q-ew.a.run.app
- **Current Revision**: d-inventory-ui-00110-q8s
- **Backend API**: https://d-inventory-api-wzwe3odv7q-ew.a.run.app

## Latest Features

For the most recent feature implementations and updates, see:
- **[AGENTS.md](../AGENTS.md)** - Complete feature history and implementation details
- **[README.md](../README.md)** - User-facing feature documentation

## 📝 Testing Best Practices

### When Generating Tests

1. **Reference Existing Patterns**: Use `authentication.service.spec.ts` as a template
2. **Follow Test Categories**:
   - Service Initialization
   - Happy Path Scenarios
   - Error Handling
   - Edge Cases
   - Security Scenarios
3. **Use Helper Functions**: Create mock data generators like `createMockToken()` and `createMockUser()`
4. **Apply Standards**: Always reference #test_coverage_standards (>80% minimum, >90% for services)
5. **Document Tests**: Include JSDoc comments explaining what each test verifies

### Example Test Generation Prompts

```typescript
// Service Testing
"Following authentication.service.spec.ts patterns, generate tests for UserService
with login validation, RBAC, and error handling. Apply #test_coverage_standards."

// Component Testing
"Following Angular component testing patterns from AGENTS.md, create tests for
DeviceFormComponent with form validation and HTTP mocking."

// Integration Testing
"Create integration tests for the device management workflow following the
comprehensive testing patterns in authentication.service.spec.ts."
```

---

> **💡 Pro Tip**: When asking Copilot for help, reference specific sections of AGENTS.md:
> - "Following the pattern from AGENTS.md, create a new Angular component..."
> - "Using the testing automation described in AGENTS.md, generate tests for..."
> - "Apply the code quality standards from #code_quality_standards to..."

**For comprehensive guidance, always consult [AGENTS.md](../AGENTS.md) first!**
