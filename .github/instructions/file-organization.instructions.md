------

alwaysApply: truealwaysApply: true

always_on: truealways_on: true

trigger: file_creationtrigger: file_creation

applyTo: '**/*.md,**/*.sh,**/*.js,**/*.ts'applyTo: '**/*.md,**/*.sh,**/*.js,**/*.ts'

description: File Organization Standards - Creating Files in Proper Locationsdescription: File Organization Standards - Creating Files in Proper Locations

# File Organization Instructions for GitHub Copilot# File Organization Instructions for GitHub Copilot

This document ensures GitHub Copilot creates new files in the appropriate subdirectories rather than cluttering the root folder.This document ensures GitHub Copilot creates new files in the appropriate subdirectories rather than cluttering the root folder.

## 🎯 Root Directory Policy## 🎯 Root Directory Policy

**Only these 4 files belong in root**:**Only these 4 files belong in root**:

- `README.md` - Main project documentation- `README.md` - Main project documentation

- `DEVELOPMENT.md` - Development workflow and setup- `DEVELOPMENT.md` - Development workflow and setup

- `AGENTS.md` - AI automation and development patterns- `AGENTS.md` - AI automation and development patterns

- `SECURITY.md` - Security policies and guidelines- `SECURITY.md` - Security policies and guidelines

**ALL other files must be created in appropriate subfolders**.**ALL other files must be created in appropriate subfolders**.

## 📁 Folder Structure and File Types## 📁 Folder Structure and File Types

### `/config/` - Configuration Files### `/config/` - Configuration Files

**Purpose**: Non-standard configuration files and configuration variants**Purpose**: Non-standard configuration files and configuration variants

**Files to create here**:**Files to create here**:

- Alternative Jest configurations (jest-*.config.ts, jest-*.config.js)- Alternative Jest configurations (jest-*.config.ts, jest-*.config.js)

- ESLint configuration files- ESLint configuration files

- Babel configuration files- Babel configuration files

- Karma test runner configuration- Karma test runner configuration

- TypeDoc/JSDoc configuration files- TypeDoc/JSDoc configuration files

- Code spell checker configuration (cspell.json)- Code spell checker configuration (cspell.json)

- Lighthouse configuration (lighthouserc.json)- Lighthouse configuration (lighthouserc.json)

- Other non-standard build/dev configs- Other non-standard build/dev configs

- Webpack configurations- Webpack configurations

- Browsersync configurations- Browsersync configurations

- Any config files that are variants or alternatives- Any config files that are variants or alternatives

**Standard configs that stay in ROOT**:**Standard configs that stay in ROOT**:

- `tsconfig.json` - TypeScript configuration (STAYS IN ROOT - required by build)- `tsconfig.json` - TypeScript configuration (STAYS IN ROOT - required by build)

- `angular.json` - Angular CLI configuration (STAYS IN ROOT - required by Angular CLI)- `angular.json` - Angular CLI configuration (STAYS IN ROOT - required by Angular CLI)

- `package.json` - NPM package definition (STAYS IN ROOT - required by NPM)- `package.json` - NPM package definition (STAYS IN ROOT - required by NPM)

- `.prettierrc.json` - Prettier rules (STAYS IN ROOT - required by IDE)- `.prettierrc.json` - Prettier rules (STAYS IN ROOT - required by IDE)

- `.editorconfig` - Editor config (STAYS IN ROOT - required by IDE)- `.editorconfig` - Editor config (STAYS IN ROOT - required by IDE)

- `.gitignore` - Git ignore (STAYS IN ROOT - required by Git)- `.gitignore` - Git ignore (STAYS IN ROOT - required by Git)

**Examples**:**Examples**:

- ✅ `config/jest.config.fast.ts` - Fast Jest variant- ✅ `config/jest.config.fast.ts` - Fast Jest variant

- ✅ `config/jest-simple.config.json` - Simplified Jest config- ✅ `config/jest-simple.config.json` - Simplified Jest config

- ✅ `config/eslint.config.js` - ESLint configuration- ✅ `config/eslint.config.js` - ESLint configuration

- ✅ `config/karma.conf.js` - Karma test runner- ✅ `config/karma.conf.js` - Karma test runner

- ✅ `config/cspell.json` - Spell checker config- ✅ `config/cspell.json` - Spell checker config

- ❌ `jest.config.ts` (should be in root or config/)- ❌ `jest.config.ts` (should be in root or config/)

- ❌ `tsconfig.json` in config/ (WRONG - must stay in root)- ❌ `tsconfig.json` in config/ (WRONG - must stay in root)

**Copilot Rule**: When asked to create a non-standard configuration file → Place in `/config/`**Copilot Rule**: When asked to create a non-standard configuration file → Place in `/config/`

### `/docs/guides/` - How-To and Setup Documentation### `/docs/guides/` - How-To and Setup Documentation

**Purpose**: Step-by-step guides, tutorials, setup instructions, debugging guides**Purpose**: Step-by-step guides, tutorials, setup instructions, debugging guides

**Files to create here**:**Files to create here**:

- Setup guides and instructions- Setup guides and instructions

- How-to tutorials and walkthroughs- How-to tutorials and walkthroughs

- Debugging guides- Debugging guides

- Configuration guides- Configuration guides

- Development setup documentation- Development setup documentation

- Installation instructions- Installation instructions

- Troubleshooting procedures- Troubleshooting procedures

- Environment setup guides- Environment setup guides

- Tool usage guides- Tool usage guides

- Workflow documentation- Workflow documentation

- Best practices guides- Best practices guides

- Coding standards documentation- Coding standards documentation

- IDE configuration guides- IDE configuration guides

**File naming conventions**:**File naming conventions**:

- `DESCRIPTIVE-GUIDE.md` (e.g., REACTIVE-FORMS-DISABLED-GUIDE.md)- `DESCRIPTIVE-GUIDE.md` (e.g., REACTIVE-FORMS-DISABLED-GUIDE.md)

- `HOW-TO-INSTRUCTIONS.md` (e.g., HOW-TO-SETUP-ENVIRONMENT.md)- `HOW-TO-INSTRUCTIONS.md` (e.g., HOW-TO-SETUP-ENVIRONMENT.md)

- `SETUP-PROCEDURE.md`- `SETUP-PROCEDURE.md`

- `DEBUGGING-TIPS.md`- `DEBUGGING-TIPS.md`

- `CONFIGURATION-GUIDE.md`- `CONFIGURATION-GUIDE.md`

- `TUTORIAL-NAME.md`- `TUTORIAL-NAME.md`

**Examples**:**Examples**:

- ✅ `docs/guides/DEBUG_SERVICE_GUIDE.md` - Service debugging tutorial- ✅ `docs/guides/DEBUG_SERVICE_GUIDE.md` - Service debugging tutorial

- ✅ `docs/guides/REACTIVE-FORMS-DISABLED-GUIDE.md` - Forms configuration- ✅ `docs/guides/REACTIVE-FORMS-DISABLED-GUIDE.md` - Forms configuration

- ✅ `docs/guides/CACHE-CLEAR-INSTRUCTIONS.md` - Cache management- ✅ `docs/guides/CACHE-CLEAR-INSTRUCTIONS.md` - Cache management

- ✅ `docs/guides/SETUP-ENVIRONMENT.md` - Development environment setup- ✅ `docs/guides/SETUP-ENVIRONMENT.md` - Development environment setup

- ✅ `docs/guides/TYPESCRIPT-STRICT-MODE-GUIDE.md` - TypeScript configuration- ✅ `docs/guides/TYPESCRIPT-STRICT-MODE-GUIDE.md` - TypeScript configuration

- ❌ `DEBUGGING-GUIDE.md` in root (belongs in /docs/guides/)- ❌ `DEBUGGING-GUIDE.md` in root (belongs in /docs/guides/)

**Copilot Rule**: When asked to create setup guides, how-to instructions, or debugging documentation → Place in `/docs/guides/`**Copilot Rule**: When asked to create setup guides, how-to instructions, or debugging documentation → Place in `/docs/guides/`

### `/docs/features/` - Feature Specifications and Implementations### `/docs/features/` - Feature Specifications and Implementations

**Purpose**: Feature specifications, implementation details, technical specifications, component documentation**Purpose**: Feature specifications, implementation details, technical specifications, component documentation

**Files to create here**:**Files to create here**:

- Feature specifications and requirements- Feature specifications and requirements

- Implementation details and technical specs- Implementation details and technical specs

- Component design documentation- Component design documentation

- System architecture documentation- System architecture documentation

- Database schema documentation- Database schema documentation

- API endpoint specifications- API endpoint specifications

- UI/UX feature documentation- UI/UX feature documentation

- Angular component documentation- Angular component documentation

- Integration guides- Integration guides

- Migration documentation- Migration documentation

- Feature status documentation- Feature status documentation

- Architecture decision records- Architecture decision records

- Technical analysis documents- Technical analysis documents

**File naming conventions**:**File naming conventions**:

- `FEATURE-NAME.md` (e.g., ANGULAR_SIGNALS_MIGRATION.md)- `FEATURE-NAME.md` (e.g., ANGULAR_SIGNALS_MIGRATION.md)

- `FEATURE-SPECIFICATION.md`- `FEATURE-SPECIFICATION.md`

- `COMPONENT-ARCHITECTURE.md`- `COMPONENT-ARCHITECTURE.md`

- `IMPLEMENTATION-DETAILS.md`- `IMPLEMENTATION-DETAILS.md`

- `DATABASE-SCHEMA.md`- `DATABASE-SCHEMA.md`

- `API-SPECIFICATION.md`- `API-SPECIFICATION.md`

**Examples**:**Examples**:

- ✅ `docs/features/ANGULAR_SIGNALS_MIGRATION.md` - Feature migration guide- ✅ `docs/features/ANGULAR_SIGNALS_MIGRATION.md` - Feature migration guide

- ✅ `docs/features/USER-MANAGEMENT-FORMS.md` - Feature implementation- ✅ `docs/features/USER-MANAGEMENT-FORMS.md` - Feature implementation

- ✅ `docs/features/PERMISSIONS-MODAL-FEATURE.md` - Feature design- ✅ `docs/features/PERMISSIONS-MODAL-FEATURE.md` - Feature design

- ✅ `docs/features/COMPONENT-ARCHITECTURE.md` - Technical architecture- ✅ `docs/features/COMPONENT-ARCHITECTURE.md` - Technical architecture

- ✅ `docs/features/DATABASE-SCHEMA-UPDATE.md` - Schema documentation- ✅ `docs/features/DATABASE-SCHEMA-UPDATE.md` - Schema documentation

- ❌ `FEATURE-SPEC.md` in root (belongs in /docs/features/)- ❌ `FEATURE-SPEC.md` in root (belongs in /docs/features/)

**Copilot Rule**: When asked to create feature specifications, implementation guides, or technical architecture documentation → Place in `/docs/features/`**Copilot Rule**: When asked to create feature specifications, implementation guides, or technical architecture documentation → Place in `/docs/features/`

### `/docs/testing/` - Test Coverage and CI/CD Documentation### `/docs/testing/` - Test Coverage and CI/CD Documentation

**Purpose**: Test coverage reports, testing strategies, CI/CD status, testing methodology, quality reports**Purpose**: Test coverage reports, testing strategies, CI/CD status, testing methodology, quality reports

**Files to create here**:**Files to create here**:

- Test coverage reports and summaries- Test coverage reports and summaries

- Authentication testing documentation- Authentication testing documentation

- Test execution results and reports- Test execution results and reports

- CI/CD pipeline status and updates- CI/CD pipeline status and updates

- Testing framework documentation- Testing framework documentation

- Test generation utilities- Test generation utilities

- Quality metrics and reports- Quality metrics and reports

- Build status documentation- Build status documentation

- Continuous integration guides- Continuous integration guides

- Testing best practices- Testing best practices

- Code quality reports- Code quality reports

- Coverage analysis- Coverage analysis

**File naming conventions**:**File naming conventions**:

- `TEST-COVERAGE-SUMMARY.md`- `TEST-COVERAGE-SUMMARY.md`

- `AUTHENTICATION-SERVICE-TESTS-SUMMARY.md`- `AUTHENTICATION-SERVICE-TESTS-SUMMARY.md`

- `CI-CD-STATUS.md`- `CI-CD-STATUS.md`

- `TESTING-METHODOLOGY.md`- `TESTING-METHODOLOGY.md`

- `QUALITY-REPORT.md`- `QUALITY-REPORT.md`

- `TEST-RESULTS.md`- `TEST-RESULTS.md`

- `COVERAGE-ANALYSIS.md`- `COVERAGE-ANALYSIS.md`

**Examples**:**Examples**:

- ✅ `docs/testing/AUTHENTICATION-SERVICE-TESTS-SUMMARY.md` - Test documentation- ✅ `docs/testing/AUTHENTICATION-SERVICE-TESTS-SUMMARY.md` - Test documentation

- ✅ `docs/testing/COVERAGE_ACHIEVEMENT_SUMMARY.md` - Coverage report- ✅ `docs/testing/COVERAGE_ACHIEVEMENT_SUMMARY.md` - Coverage report

- ✅ `docs/testing/CI-CD-STATUS.md` - Pipeline status- ✅ `docs/testing/CI-CD-STATUS.md` - Pipeline status

- ✅ `docs/testing/TEST-COVERAGE-SUMMARY.md` - Overall coverage- ✅ `docs/testing/TEST-COVERAGE-SUMMARY.md` - Overall coverage

- ✅ `docs/testing/AUTHENTICATION-TESTS-QUICK-START.md` - Quick reference- ✅ `docs/testing/AUTHENTICATION-TESTS-QUICK-START.md` - Quick reference

- ❌ `TEST-SUMMARY.md` in root (belongs in /docs/testing/)- ❌ `TEST-SUMMARY.md` in root (belongs in /docs/testing/)

**Copilot Rule**: When asked to create test coverage reports, CI/CD documentation, or testing methodology files → Place in `/docs/testing/`**Copilot Rule**: When asked to create test coverage reports, CI/CD documentation, or testing methodology files → Place in `/docs/testing/`

### `/docs/deployment/` - Deployment and Release Documentation### `/docs/deployment/` - Deployment and Release Documentation

**Purpose**: Deployment procedures, release notes, deployment guides, production documentation**Purpose**: Deployment procedures, release notes, deployment guides, production documentation

**Files to create here**:**Files to create here**:

- Deployment procedures and guides- Deployment procedures and guides

- Release notes and change logs- Release notes and change logs

- Production deployment documentation- Production deployment documentation

- Deployment checklist and procedures- Deployment checklist and procedures

- Cloud deployment guides- Cloud deployment guides

- Docker deployment guides- Docker deployment guides

- Release planning documentation- Release planning documentation

- Rollback procedures- Rollback procedures

- Deployment strategies- Deployment strategies

**File naming conventions**:**File naming conventions**:

- `DEPLOYMENT-GUIDE.md`- `DEPLOYMENT-GUIDE.md`

- `PRODUCTION-DEPLOYMENT-GUIDE.md`- `PRODUCTION-DEPLOYMENT-GUIDE.md`

- `RELEASE-NOTES.md`- `RELEASE-NOTES.md`

- `RELEASE-PROCEDURE.md`- `RELEASE-PROCEDURE.md`

- `DEPLOYMENT-CHECKLIST.md`- `DEPLOYMENT-CHECKLIST.md`

**Examples**:**Examples**:

- ✅ `docs/deployment/PRODUCTION-DEPLOYMENT-GUIDE.md` - Production deployment- ✅ `docs/deployment/PRODUCTION-DEPLOYMENT-GUIDE.md` - Production deployment

- ✅ `docs/deployment/DEPLOYMENT-SUCCESS.md` - Successful deployment report- ✅ `docs/deployment/DEPLOYMENT-SUCCESS.md` - Successful deployment report

- ✅ `docs/deployment/RELEASE-NOTES-v1.0.md` - Version release notes- ✅ `docs/deployment/RELEASE-NOTES-v1.0.md` - Version release notes

- ❌ `DEPLOYMENT-GUIDE.md` in root (belongs in /docs/deployment/)- ❌ `DEPLOYMENT-GUIDE.md` in root (belongs in /docs/deployment/)

**Copilot Rule**: When asked to create deployment guides, release notes, or release procedures → Place in `/docs/deployment/`**Copilot Rule**: When asked to create deployment guides, release notes, or release procedures → Place in `/docs/deployment/`

### `/docs/archive/troubleshooting/` - Resolved Issues and Historical Documentation### `/docs/archive/troubleshooting/` - Resolved Issues and Historical Documentation

**Purpose**: Archived issues, historical troubleshooting, resolved problems, reference material**Purpose**: Archived issues, historical troubleshooting, resolved problems, reference material

**Files to create here**:**Files to create here**:

- Resolved issue documentation- Resolved issue documentation

- Historical bug fixes and patches- Historical bug fixes and patches

- Admin role fixes and workarounds- Admin role fixes and workarounds

- Feature fixes and corrections- Feature fixes and corrections

- CORS fixes and patches- CORS fixes and patches

- Authentication issue resolutions- Authentication issue resolutions

- Build and deployment issues (resolved)- Build and deployment issues (resolved)

- Database migration issues (resolved)- Database migration issues (resolved)

- Past deployments and their solutions- Past deployments and their solutions

- Historical problem analysis- Historical problem analysis

- Deprecated feature documentation- Deprecated feature documentation

**File naming conventions**:**File naming conventions**:

- Issue name with context (e.g., `ADMIN-ACCESS-FIX.md`)- Issue name with context (e.g., `ADMIN-ACCESS-FIX.md`)

- `ISSUE-RESOLUTION.md`- `ISSUE-RESOLUTION.md`

- `BUG-FIX-REPORT.md`- `BUG-FIX-REPORT.md`

- Problem type with solution (e.g., `CORS-FIX-SUMMARY.md`)- Problem type with solution (e.g., `CORS-FIX-SUMMARY.md`)

**Examples**:**Examples**:

- ✅ `docs/archive/troubleshooting/ADMIN-ACCESS-FIX.md` - Admin access issue resolution- ✅ `docs/archive/troubleshooting/ADMIN-ACCESS-FIX.md` - Admin access issue resolution

- ✅ `docs/archive/troubleshooting/CSRF-FIX-SUMMARY.md` - CSRF security fix- ✅ `docs/archive/troubleshooting/CSRF-FIX-SUMMARY.md` - CSRF security fix

- ✅ `docs/archive/troubleshooting/DATABASE-MIGRATION-COMPLETE.md` - Migration completion- ✅ `docs/archive/troubleshooting/DATABASE-MIGRATION-COMPLETE.md` - Migration completion

- ✅ `docs/archive/troubleshooting/403-GITHUB-ISSUES-ERROR.md` - GitHub API error resolution- ✅ `docs/archive/troubleshooting/403-GITHUB-ISSUES-ERROR.md` - GitHub API error resolution

- ✅ `docs/archive/troubleshooting/DEPLOYMENT-SUCCESS.md` - Historical deployment- ✅ `docs/archive/troubleshooting/DEPLOYMENT-SUCCESS.md` - Historical deployment

- ❌ `BUG-FIX.md` in root (belongs in /docs/archive/troubleshooting/)- ❌ `BUG-FIX.md` in root (belongs in /docs/archive/troubleshooting/)

**Copilot Rule**: When asked to create documentation about resolved issues, past fixes, or historical troubleshooting → Place in `/docs/archive/troubleshooting/`**Copilot Rule**: When asked to create documentation about resolved issues, past fixes, or historical troubleshooting → Place in `/docs/archive/troubleshooting/`

### `/src/` - Application Source Code### `/src/` - Application Source Code

**Purpose**: Main application code (already organized)**Purpose**: Main application code (already organized)

**Structure**:**Structure**:

- `src/app/` - Angular application components and services- `src/app/` - Angular application components and services

- `src/app/services/` - Angular services- `src/app/services/` - Angular services

- `src/app/components/` - Angular components- `src/app/components/` - Angular components

- `src/app/models/` - Data models and interfaces- `src/app/models/` - Data models and interfaces

- `src/app/guards/` - Route guards and interceptors- `src/app/guards/` - Route guards and interceptors

- `src/assets/` - Static assets- `src/assets/` - Static assets

**Copilot Rule**: When asked to create application code, components, services, or models → Place in `/src/`**Copilot Rule**: When asked to create application code, components, services, or models → Place in `/src/`

### `/scripts/` - Automation and Utility Scripts### `/scripts/` - Automation and Utility Scripts

**Purpose**: Development automation, build scripts, utility scripts (not in API project)**Purpose**: Development automation, build scripts, utility scripts (not in API project)

**For 3d-inventory-ui**:**For 3d-inventory-ui**:

- Build automation scripts- Build automation scripts

- Development utility scripts- Development utility scripts

- Testing automation- Testing automation

- Deployment helpers- Deployment helpers

- Git hook utilities- Git hook utilities

**Copilot Rule**: When asked to create automation or utility scripts → Place in `/scripts/`**Copilot Rule**: When asked to create automation or utility scripts → Place in `/scripts/`

## ✅ File Creation Decision Tree## ✅ File Creation Decision Tree

Use this flowchart to determine where a new file should be created:Use this flowchart to determine where a new file should be created:

`text`

START: Creating a new fileSTART: Creating a new file

││

├─ Is it one of the 4 protected files?├─ Is it one of the 4 protected files?

│ (README.md, DEVELOPMENT.md, AGENTS.md, SECURITY.md)│ (README.md, DEVELOPMENT.md, AGENTS.md, SECURITY.md)

│ └─ YES → CREATE IN ROOT ✓│ └─ YES → CREATE IN ROOT ✓

││

├─ Is it a standard configuration file?├─ Is it a standard configuration file?

│ (tsconfig.json, angular.json, package.json, .prettierrc, .editorconfig, .gitignore)│ (tsconfig.json, angular.json, package.json, .prettierrc, .editorconfig, .gitignore)

│ └─ YES → CREATE IN ROOT ✓│ └─ YES → CREATE IN ROOT ✓

││

├─ Is it a non-standard or variant configuration?├─ Is it a non-standard or variant configuration?

│ (jest-*.config.ts, eslint.config.js, karma.conf.js, cspell.json, etc.)│ (jest-*.config.ts, eslint.config.js, karma.conf.js, cspell.json, etc.)

│ └─ YES → CREATE IN /config/ ✓│ └─ YES → CREATE IN /config/ ✓

││

├─ Is it a setup, how-to, debugging, or configuration guide?├─ Is it a setup, how-to, debugging, or configuration guide?

│ (Tutorial, walkthrough, environment setup, debugging guide)│ (Tutorial, walkthrough, environment setup, debugging guide)

│ └─ YES → CREATE IN /docs/guides/ ✓│ └─ YES → CREATE IN /docs/guides/ ✓

││

├─ Is it a feature specification or technical implementation?├─ Is it a feature specification or technical implementation?

│ (Feature spec, component design, architecture, API docs)│ (Feature spec, component design, architecture, API docs)

│ └─ YES → CREATE IN /docs/features/ ✓│ └─ YES → CREATE IN /docs/features/ ✓

││

├─ Is it a test report, coverage summary, or CI/CD documentation?├─ Is it a test report, coverage summary, or CI/CD documentation?

│ (Test summary, coverage report, build status)│ (Test summary, coverage report, build status)

│ └─ YES → CREATE IN /docs/testing/ ✓│ └─ YES → CREATE IN /docs/testing/ ✓

││

├─ Is it a deployment guide or release documentation?├─ Is it a deployment guide or release documentation?

│ (Deployment procedure, release notes, rollback guide)│ (Deployment procedure, release notes, rollback guide)

│ └─ YES → CREATE IN /docs/deployment/ ✓│ └─ YES → CREATE IN /docs/deployment/ ✓

││

├─ Is it documentation about a resolved issue or historical fix?├─ Is it documentation about a resolved issue or historical fix?

│ (Past bug fix, admin issue resolution, deprecated feature)│ (Past bug fix, admin issue resolution, deprecated feature)

│ └─ YES → CREATE IN /docs/archive/troubleshooting/ ✓│ └─ YES → CREATE IN /docs/archive/troubleshooting/ ✓

││

├─ Is it application code, component, or service?├─ Is it application code, component, or service?

│ └─ YES → CREATE IN /src/ ✓│ └─ YES → CREATE IN /src/ ✓

││

├─ Is it an automation or development utility script?├─ Is it an automation or development utility script?

│ └─ YES → CREATE IN /scripts/ ✓│ └─ YES → CREATE IN /scripts/ ✓

││

└─ NOT SURE?└─ NOT SURE?

└─ ASK FOR CLARIFICATION OR PLACE IN MOST APPROPRIATE CATEGORY ✓ └─ ASK FOR CLARIFICATION OR PLACE IN MOST APPROPRIATE CATEGORY ✓
`````

## 📋 File Type Detection Rules## 📋 File Type Detection Rules

### How Copilot Should Detect File Purpose### How Copilot Should Detect File Purpose

#### Configuration Files#### Configuration Files

**Indicators**:**Indicators**:

- Filename ends with `.config.js`, `.config.ts`, `.config.json`

- Filename ends with `.config.js`, `.config.ts`, `.config.json`- Filename starts with `.` (dot files): `.babelrc`, `.eslintrc`, `.prettierrc`

- Filename starts with `.` (dot files): `.babelrc`, `.eslintrc`, `.prettierrc`- Contains configuration keywords: "config", "eslint", "jest", "karma", "babel"

- Contains configuration keywords: "config", "eslint", "jest", "karma", "babel"- Referenced in build/dev scripts as alternative configuration

- Referenced in build/dev scripts as alternative configuration

**Decision**: → `/config/` (unless it's a standard config that must stay in root)

**Decision**: → `/config/` (unless it's a standard config that must stay in root)

#### Documentation Files

#### Documentation Files

**Detection by purpose** (read filename and first lines):

**Detection by purpose** (read filename and first lines):

1. **Setup/How-To Guide**

1. **Setup/How-To Guide** - Keywords: "setup", "install", "how-to", "guide", "tutorial", "debug", "troubleshoot", "configure"
   - Example: `DEBUG_SERVICE_GUIDE.md`, `SETUP-ENVIRONMENT.md`

   - Keywords: "setup", "install", "how-to", "guide", "tutorial", "debug", "troubleshoot", "configure" - Decision: → `/docs/guides/`

   - Example: `DEBUG_SERVICE_GUIDE.md`, `SETUP-ENVIRONMENT.md`

   - Decision: → `/docs/guides/`2. **Feature Specification**

   - Keywords: "feature", "implementation", "component", "architecture", "specification", "schema", "design"

1. **Feature Specification** - Example: `ANGULAR_SIGNALS_MIGRATION.md`, `COMPONENT-ARCHITECTURE.md`
   - Decision: → `/docs/features/`

   - Keywords: "feature", "implementation", "component", "architecture", "specification", "schema", "design"

   - Example: `ANGULAR_SIGNALS_MIGRATION.md`, `COMPONENT-ARCHITECTURE.md`3. **Test/Quality Report**

   - Decision: → `/docs/features/` - Keywords: "test", "coverage", "quality", "ci/cd", "status", "report", "authentication"

   - Example: `TEST-COVERAGE-SUMMARY.md`, `CI-CD-STATUS.md`

1. **Test/Quality Report** - Decision: → `/docs/testing/`
   - Keywords: "test", "coverage", "quality", "ci/cd", "status", "report", "authentication"4. **Deployment Documentation**

   - Example: `TEST-COVERAGE-SUMMARY.md`, `CI-CD-STATUS.md` - Keywords: "deployment", "release", "production", "rollout", "release-notes"

   - Decision: → `/docs/testing/` - Example: `DEPLOYMENT-GUIDE.md`, `RELEASE-NOTES.md`

   - Decision: → `/docs/deployment/`

1. **Deployment Documentation**

1. **Historical Issue/Fix**
   - Keywords: "deployment", "release", "production", "rollout", "release-notes" - Keywords: "fix", "resolved", "issue", "error", "problem", "bug", "deprecated"

   - Example: `DEPLOYMENT-GUIDE.md`, `RELEASE-NOTES.md` - Pattern: `ISSUE-NAME-FIX.md`, `PROBLEM-RESOLUTION.md`

   - Decision: → `/docs/deployment/` - Content: Describes a past issue that has been resolved

   - Example: `ADMIN-ACCESS-FIX.md`, `CSRF-FIX-SUMMARY.md`

1. **Historical Issue/Fix** - Decision: → `/docs/archive/troubleshooting/`
   - Keywords: "fix", "resolved", "issue", "error", "problem", "bug", "deprecated"### Script Files

   - Pattern: `ISSUE-NAME-FIX.md`, `PROBLEM-RESOLUTION.md`

   - Content: Describes a past issue that has been resolved**Indicators**:

   - Example: `ADMIN-ACCESS-FIX.md`, `CSRF-FIX-SUMMARY.md`- Filename ends with `.sh`, `.js`, `.ts`

   - Decision: → `/docs/archive/troubleshooting/`- Contains automation, deployment, or build logic

- Executable or meant to be run with npm/node

### Script Files

**Decision**: → `/scripts/`

**Indicators**:

### Application Code

- Filename ends with `.sh`, `.js`, `.ts`

- Contains automation, deployment, or build logic**Indicators**:

- Executable or meant to be run with npm/node- TypeScript or JavaScript component/service

- Part of src directory structure

**Decision**: → `/scripts/`- Angular component, service, model, or guard

### Application Code**Decision**: → `/src/`

**Indicators**:---

- TypeScript or JavaScript component/service## 🔍 Edge Cases and Special Rules

- Part of src directory structure

- Angular component, service, model, or guard### Edge Case 1: File Could Fit Multiple Categories

**Decision**: → `/src/`**Example**: `USER-AUTHENTICATION-TESTING-GUIDE.md`

---

**Resolution**:

- Primary purpose wins

## 🔍 Edge Cases and Special Rules- If primarily a guide on how to test → `/docs/testing/`

- If primarily about authentication feature → `/docs/features/`

### Edge Case 1: File Could Fit Multiple Categories- If primarily historical troubleshooting → `/docs/archive/troubleshooting/`

**Example**: `USER-AUTHENTICATION-TESTING-GUIDE.md`**Rule**: Categorize by PRIMARY PURPOSE, not all purposes

**Resolution**:### Edge Case 2: Configuration File That's Actually Documentation

- Primary purpose wins**Example**: `eslint-rules-explanation.md`

- If primarily a guide on how to test → `/docs/testing/`

- If primarily about authentication feature → `/docs/features/`**Resolution**:

- If primarily historical troubleshooting → `/docs/archive/troubleshooting/`- If it's documentation ABOUT a config → `/docs/guides/`

- If it's the actual config file → `/config/`

**Rule**: Categorize by PRIMARY PURPOSE, not all purposes

**Rule**: Determine actual file type (documentation vs configuration)

### Edge Case 2: Configuration File That's Actually Documentation

### Edge Case 3: File Type Unknown

**Example**: `eslint-rules-explanation.md`

**Example**: Copilot isn't sure which category a file fits

**Resolution**:

**Resolution**:

- If it's documentation ABOUT a config → `/docs/guides/`1. Check the decision tree above

- If it's the actual config file → `/config/`2. Read the filename and first lines of content

3. Match PRIMARY PURPOSE to categories

**Rule**: Determine actual file type (documentation vs configuration)4. If truly ambiguous:

- Place in `/docs/guides/` (most flexible)

### Edge Case 3: File Type Unknown - Add comment explaining categorization

- Flag for team review

**Example**: Copilot isn't sure which category a file fits

**Rule**: Default to `/docs/guides/` if unsure (least risky choice)

**Resolution**:

### Edge Case 4: File Seems Like Root Documentation

1. Check the decision tree above

2. Read the filename and first lines of content**Example**: `PERFORMANCE-OPTIMIZATION-PLAN.md`

3. Match PRIMARY PURPOSE to categories

4. If truly ambiguous:**Resolution**:
   - Place in `/docs/guides/` (most flexible)- If it's strategic/organizational → Could be root (ask team)

   - Add comment explaining categorization- If it's procedural/technical → `/docs/guides/` or `/docs/features/`

   - Flag for team review- Default: Unless it's one of 4 protected files → Put in appropriate `/docs/` subdirectory

**Rule**: Default to `/docs/guides/` if unsure (least risky choice)**Rule**: MOST documentation belongs in `/docs/` subdirectories

### Edge Case 4: File Seems Like Root Documentation---

**Example**: `PERFORMANCE-OPTIMIZATION-PLAN.md`## 📝 Naming Conventions

**Resolution**:### Standardized Naming Patterns

- If it's strategic/organizational → Could be root (ask team)#### Configuration Files

- If it's procedural/technical → `/docs/guides/` or `/docs/features/````

- Default: Unless it's one of 4 protected files → Put in appropriate `/docs/` subdirectoryjest.config.ts - Standard format

jest-simple.config.ts - Variant format (hyphen + descriptor)

**Rule**: MOST documentation belongs in `/docs/` subdirectorieseslint.config.js - Standard format

.babelrc - Dot files (special configs)

---cspell.json - Tool-specific naming

````

## 📝 Naming Conventions

#### Documentation Files

### Standardized Naming Patterns```

Guides:

#### Configuration FilesDESCRIPTIVE-GUIDE.md            - Primary guide format

HOW-TO-INSTRUCTIONS.md          - Procedure/instruction format

```bashSETUP-ENVIRONMENT.md            - Setup procedure format

jest.config.ts                  # Standard formatDEBUG_SERVICE_GUIDE.md          - Underscore variant accepted

jest-simple.config.ts           # Variant format (hyphen + descriptor)

eslint.config.js                # Standard formatFeatures:

.babelrc                        # Dot files (special configs)FEATURE-NAME.md                 - Simple feature naming

cspell.json                     # Tool-specific namingANGULAR_SIGNALS_MIGRATION.md    - Migration naming

```COMPONENT-ARCHITECTURE.md       - Architecture documentation

USER-MANAGEMENT-FORMS.md        - Feature with context

#### Documentation Files

Testing:

```bashTEST-COVERAGE-SUMMARY.md        - Summary format

# Guides:AUTHENTICATION-TESTS-QUICK-START.md  - Detailed format

DESCRIPTIVE-GUIDE.md            # Primary guide formatCI-CD-STATUS.md                 - Status format

HOW-TO-INSTRUCTIONS.md          # Procedure/instruction formatCOVERAGE_ACHIEVEMENT_SUMMARY.md - Report format

SETUP-ENVIRONMENT.md            # Setup procedure format

DEBUG_SERVICE_GUIDE.md          # Underscore variant acceptedDeployment:

DEPLOYMENT-GUIDE.md             - Guide format

# Features:PRODUCTION-DEPLOYMENT-GUIDE.md  - Specific instance format

FEATURE-NAME.md                 # Simple feature namingRELEASE-NOTES-v1.0.md           - Version-specific format

ANGULAR_SIGNALS_MIGRATION.md    # Migration namingDEPLOYMENT-SUCCESS.md           - Status format

COMPONENT-ARCHITECTURE.md       # Architecture documentation

USER-MANAGEMENT-FORMS.md        # Feature with contextArchive/Troubleshooting:

ISSUE-NAME-FIX.md               - Issue resolution format

# Testing:ADMIN-ACCESS-FIX.md             - Specific issue format

TEST-COVERAGE-SUMMARY.md        # Summary formatCSRF-FIX-SUMMARY.md             - Technical fix format

AUTHENTICATION-TESTS-QUICK-START.md  # Detailed format403-GITHUB-ISSUES-ERROR.md      - Error code format

CI-CD-STATUS.md                 # Status format```

COVERAGE_ACHIEVEMENT_SUMMARY.md # Report format

### Conventions to Follow

# Deployment:

DEPLOYMENT-GUIDE.md             # Guide format1. **Use kebab-case for most filenames**

PRODUCTION-DEPLOYMENT-GUIDE.md  # Specific instance format   - ✅ `DEBUG-SERVICE-GUIDE.md`

RELEASE-NOTES-v1.0.md           # Version-specific format   - ✅ `ANGULAR-SIGNALS-MIGRATION.md`

DEPLOYMENT-SUCCESS.md           # Status format   - ❌ `DebugServiceGuide.md` (avoid CamelCase)



# Archive/Troubleshooting:2. **Use UPPERCASE for emphasis** (standard for docs)

ISSUE-NAME-FIX.md               # Issue resolution format   - ✅ `DEBUG_SERVICE_GUIDE.md`

ADMIN-ACCESS-FIX.md             # Specific issue format   - ✅ `AUTHENTICATION-SERVICE-TESTS-SUMMARY.md`

CSRF-FIX-SUMMARY.md             # Technical fix format   - ✅ `CI-CD-STATUS.md`

403-GITHUB-ISSUES-ERROR.md      # Error code format

```3. **Use hyphens for multi-word filenames**

   - ✅ `REACTIVE-FORMS-DISABLED-GUIDE.md`

### Conventions to Follow   - ✅ `ADMIN-ACCESS-FIX.md`

   - ❌ `ReactiveFormsDisabledGuide.md`

1. **Use kebab-case for most filenames**

4. **Be descriptive but concise**

   - ✅ `DEBUG-SERVICE-GUIDE.md`   - ✅ `DEPLOYMENT-GUIDE.md` (clear purpose)

   - ✅ `ANGULAR-SIGNALS-MIGRATION.md`   - ❌ `guide.md` (too generic)

   - ❌ `DebugServiceGuide.md` (avoid CamelCase)   - ❌ `ALL_DEPLOYMENT_INFORMATION_AND_PROCEDURES_GUIDE.md` (too long)



2. **Use UPPERCASE for emphasis** (standard for docs)5. **Include context when necessary**

   - ✅ `AUTHENTICATION-SERVICE-TESTS-SUMMARY.md` (specific)

   - ✅ `DEBUG_SERVICE_GUIDE.md`   - ✅ `ADMIN-PERMISSIONS-FIX.md` (specific to admin)

   - ✅ `AUTHENTICATION-SERVICE-TESTS-SUMMARY.md`   - ❌ `TESTS.md` (too generic)

   - ✅ `CI-CD-STATUS.md`

---

3. **Use hyphens for multi-word filenames**

## 🚀 Copilot Creation Workflow

   - ✅ `REACTIVE-FORMS-DISABLED-GUIDE.md`

   - ✅ `ADMIN-ACCESS-FIX.md`### When User Requests File Creation

   - ❌ `ReactiveFormsDisabledGuide.md`

**Example**: "Create a guide for debugging the authentication service"

4. **Be descriptive but concise**

**Copilot Should**:

   - ✅ `DEPLOYMENT-GUIDE.md` (clear purpose)

   - ❌ `guide.md` (too generic)1. **Analyze Request**

   - ❌ `ALL_DEPLOYMENT_INFORMATION_AND_PROCEDURES_GUIDE.md` (too long)   - Purpose: Debugging guide

   - Topic: Authentication service

5. **Include context when necessary**   - Type: Documentation



   - ✅ `AUTHENTICATION-SERVICE-TESTS-SUMMARY.md` (specific)2. **Determine Category**

   - ✅ `ADMIN-PERMISSIONS-FIX.md` (specific to admin)   - Primary purpose: Help developer debug

   - ❌ `TESTS.md` (too generic)   - Category: `/docs/guides/`

   - Pattern: `DEBUG-AUTH-SERVICE-GUIDE.md`

---

3. **Propose Location**

## 🚀 Copilot Creation Workflow   - Suggest: `docs/guides/DEBUG-AUTH-SERVICE-GUIDE.md`

   - Confirm: "Should I create this in `/docs/guides/`?"

### When User Requests File Creation

4. **Create File**

**Example**: "Create a guide for debugging the authentication service"   - Create at: `/docs/guides/DEBUG-AUTH-SERVICE-GUIDE.md`

   - Verify path is correct

**Copilot Should**:   - Ensure file goes to right location



1. **Analyze Request**5. **Confirm Success**

   - Purpose: Debugging guide   - "✅ Created: docs/guides/DEBUG-AUTH-SERVICE-GUIDE.md"

   - Topic: Authentication service

   - Type: Documentation### When User Asks for Configuration File



2. **Determine Category****Example**: "Create a fast Jest configuration"

   - Primary purpose: Help developer debug

   - Category: `/docs/guides/`**Copilot Should**:

   - Pattern: `DEBUG-AUTH-SERVICE-GUIDE.md`

1. **Analyze Request**

3. **Propose Location**   - Purpose: Alternative Jest config

   - Suggest: `docs/guides/DEBUG-AUTH-SERVICE-GUIDE.md`   - Type: Configuration variant

   - Confirm: "Should I create this in `/docs/guides/`?"   - Category: `/config/`



4. **Create File**2. **Determine Filename**

   - Create at: `/docs/guides/DEBUG-AUTH-SERVICE-GUIDE.md`   - Pattern: `jest-fast.config.ts`

   - Verify path is correct   - Location: `/config/jest-fast.config.ts`

   - Ensure file goes to right location

3. **Create File**

5. **Confirm Success**   - Confirm user agrees with location

   - "✅ Created: docs/guides/DEBUG-AUTH-SERVICE-GUIDE.md"   - Create in correct directory

   - Verify it won't interfere with standard configs

### When User Asks for Configuration File

4. **Update References**

**Example**: "Create a fast Jest configuration"   - Check if package.json needs script update

   - Suggest: `"test:fast": "jest --config config/jest-fast.config.ts"`

**Copilot Should**:

---

1. **Analyze Request**

   - Purpose: Alternative Jest config## 🔄 Maintenance and Verification

   - Type: Configuration variant

   - Category: `/config/`### Regular Compliance Checks



2. **Determine Filename****Perform these checks periodically**:

   - Pattern: `jest-fast.config.ts`

   - Location: `/config/jest-fast.config.ts`1. **Check for misplaced files**

   ```bash

3. **Create File**   # Find .md files in root (should only be 4)

   - Confirm user agrees with location   cd /home/karol/GitHub/3d-inventory-ui

   - Create in correct directory   ls -1 *.md | grep -v "README\|AGENTS\|LICENSE\|SECURITY" | wc -l

   - Verify it won't interfere with standard configs   # Should return: 0

````

4. **Update References**
   - Check if package.json needs script update2. **Verify directory structure**

   - Suggest: `"test:fast": "jest --config config/jest-fast.config.ts"` ```bash

   # Count files in each directory

--- echo "Config files: $(ls -1 config/ | wc -l)"

echo "Docs files: $(find docs -type f | wc -l)"

## 🔄 Maintenance and Verification echo "Guides: $(ls -1 docs/guides/ | wc -l)"

echo "Features: $(ls -1 docs/features/ | wc -l)"

### Regular Compliance Checks echo "Testing: $(ls -1 docs/testing/ | wc -l)"

````

**Perform these checks periodically**:

3. **Identify any files that don't fit**

1. **Check for misplaced files**   ```bash

# Check for large or unusual files in root

```bash   ls -lh | sort -k5 -h | tail -10

cd /home/karol/GitHub/3d-inventory-ui   ```

ls -1 *.md | grep -v "README\|AGENTS\|LICENSE\|SECURITY" | wc -l

# Should return: 0### When Files Go in Wrong Location

````

**Recovery Procedure**:

2. **Verify directory structure**

1. **Identify misplaced file**

   ````bash - File found in root that shouldn't be

   echo "Config files: $(ls -1 config/ | wc -l)"   - Example: `NEW-FEATURE.md` in root

   echo "Docs files: $(find docs -type f | wc -l)"

   echo "Guides: $(ls -1 docs/guides/ | wc -l)"2. **Determine correct location**

   echo "Features: $(ls -1 docs/features/ | wc -l)"   - Read filename and content

   echo "Testing: $(ls -1 docs/testing/ | wc -l)"   - Apply decision tree

   ```   - Verify destination folder exists

   ````

1. **Identify any files that don't fit**3. **Move file to correct location**

   ````bash

   ```bash   mv NEW-FEATURE.md docs/features/

   ls -lh | sort -k5 -h | tail -10   ```

   ````

1. **Verify references updated**

### When Files Go in Wrong Location - Check if any links need updating

- Update import statements if needed

**Recovery Procedure**: - Run linter/formatter

1. **Identify misplaced file**5. **Commit change**
   - File found in root that shouldn't be ```bash

   - Example: `NEW-FEATURE.md` in root git add NEW-FEATURE.md docs/features/

   git commit -m "docs: move NEW-FEATURE.md to proper location"

2. **Determine correct location** ```
   - Read filename and content

   - Apply decision tree---

   - Verify destination folder exists

## 📞 Questions and Override Procedures

3. **Move file to correct location**

### When Copilot Is Unsure

```bash

mv NEW-FEATURE.md docs/features/**Situation**: File doesn't clearly fit a category

```

**Procedure**:

4. **Verify references updated**
   - Check if any links need updating1. **Ask clarifying question**

   - Update import statements if needed - "Is this primarily a guide/tutorial or a specification?"

   - Run linter/formatter - "Is this a resolved issue or current documentation?"

   - "Is this a configuration file or documentation about configuration?"

5. **Commit change**

6. **Suggest most likely location**

   ```bash - Based on filename and partial content

   git add NEW-FEATURE.md docs/features/   - Include reasoning

   git commit -m "docs: move NEW-FEATURE.md to proper location"   - Example: "Based on the keywords 'setup' and 'configuration', I suggest `/docs/guides/`"

   ```

7. **Allow user override**

--- - Let user specify different location if needed

- Accept user's categorization as authoritative

## 📞 Questions and Override Procedures - Remember pattern for future similar files

### When Copilot Is Unsure### When User Explicitly Specifies Location

**Situation**: File doesn't clearly fit a category**Procedure**:

**Procedure**:1. **Honor user specification**

- If user says "Create at `/docs/testing/`" → Create there

1. **Ask clarifying question** - Don't second-guess user decision
   - "Is this primarily a guide/tutorial or a specification?" - Trust user's categorization knowledge

   - "Is this a resolved issue or current documentation?"

   - "Is this a configuration file or documentation about configuration?"2. **Confirm understanding**

   - "Creating at: `/docs/testing/FILE-NAME.md` ✓"

2. **Suggest most likely location**
   - Based on filename and partial content3. **Learn from override**

   - Include reasoning - If user overrides decision, note the reason

   - Example: "Based on the keywords 'setup' and 'configuration', I suggest `/docs/guides/`" - May indicate edge case or category extension

   - Could inform future similar requests

3. **Allow user override**
   - Let user specify different location if needed---

   - Accept user's categorization as authoritative

   - Remember pattern for future similar files## 📚 Complete File Organization Map

### When User Explicitly Specifies Location### Root Directory (Only 4 Protected Files + Required Build Configs)

**Procedure**:```

README.md ← Main documentation

1. **Honor user specification**AGENTS.md ← AI automation guide
   - If user says "Create at `/docs/testing/`" → Create thereLICENSE ← Licensing information

   - Don't second-guess user decisionSECURITY.md ← Security policies

   - Trust user's categorization knowledge

tsconfig.json ← TypeScript config (standard - REQUIRED)

2. **Confirm understanding**angular.json ← Angular config (standard - REQUIRED)
   - "Creating at: `/docs/testing/FILE-NAME.md` ✓"package.json ← NPM config (standard - REQUIRED)

.prettierrc.json ← Prettier rules (standard - REQUIRED)

3. **Learn from override**.editorconfig ← Editor config (standard - REQUIRED)
   - If user overrides decision, note the reason.gitignore ← Git ignore (standard - REQUIRED)

   - May indicate edge case or category extension

   - Could inform future similar requestsjest.config.ts ← Jest config (in root OR /config/)

```

---

### `/config/` - Configuration Variants

## 📚 Complete File Organization Map

```

### Root Directory (Only 4 Protected Files + Required Build Configs)jest.config.fast.ts ← Jest variant

jest-simple.config.ts ← Jest variant

````bashjest.config.js ← Jest variant

README.md                   # Main documentationeslint.config.js            ← ESLint config

AGENTS.md                   # AI automation guidekarma.conf.js               ← Karma config

LICENSE                     # Licensing information.babelrc                    ← Babel config

SECURITY.md                 # Security policiescspell.json                 ← Spell checker

lighthouserc.json           ← Lighthouse

tsconfig.json               # TypeScript config (standard - REQUIRED)typedoc.json                ← TypeDoc

angular.json                # Angular config (standard - REQUIRED)jsdoc.json                  ← JSDoc

package.json                # NPM config (standard - REQUIRED)```

.prettierrc.json            # Prettier rules (standard - REQUIRED)

.editorconfig               # Editor config (standard - REQUIRED)### `/docs/guides/` - Setup, How-To, Debugging (15+ files)

.gitignore                  # Git ignore (standard - REQUIRED)

````

jest.config.ts # Jest config (in root OR /config/)DEBUG_SERVICE_GUIDE.md

````REACTIVE-FORMS-DISABLED-GUIDE.md

CACHE-CLEAR-INSTRUCTIONS.md

### `/config/` - Configuration VariantsSETUP-ENVIRONMENT.md

TYPESCRIPT-STRICT-MODE-GUIDE.md

```bash... and more how-to guides ...

jest.config.fast.ts         # Jest variant```

jest-simple.config.ts       # Jest variant

jest.config.js              # Jest variant### `/docs/features/` - Feature Specs, Architecture (9+ files)

eslint.config.js            # ESLint config

karma.conf.js               # Karma config```

.babelrc                    # Babel configANGULAR_SIGNALS_MIGRATION.md

cspell.json                 # Spell checkerUSER-MANAGEMENT-FORMS.md

lighthouserc.json           # LighthousePERMISSIONS-MODAL-FEATURE.md

typedoc.json                # TypeDocCOMPONENT-ARCHITECTURE.md

jsdoc.json                  # JSDoc... and more feature documentation ...

````

### `/docs/guides/` - Setup, How-To, Debugging (15+ files)### `/docs/testing/` - Test Coverage, CI/CD (9+ files)

`bash`

DEBUG_SERVICE_GUIDE.mdAUTHENTICATION-SERVICE-TESTS-SUMMARY.md

REACTIVE-FORMS-DISABLED-GUIDE.mdCOVERAGE_ACHIEVEMENT_SUMMARY.md

CACHE-CLEAR-INSTRUCTIONS.mdCI-CD-STATUS.md

SETUP-ENVIRONMENT.mdTEST-COVERAGE-SUMMARY.md

TYPESCRIPT-STRICT-MODE-GUIDE.md... and more testing documentation ...

````



### `/docs/features/` - Feature Specs, Architecture (9+ files)### `/docs/deployment/` - Deployment, Release (3+ files)



```bash```

ANGULAR_SIGNALS_MIGRATION.mdPRODUCTION-DEPLOYMENT-GUIDE.md

USER-MANAGEMENT-FORMS.mdDEPLOYMENT-SUCCESS.md

PERMISSIONS-MODAL-FEATURE.mdRELEASE-NOTES-v1.0.md

COMPONENT-ARCHITECTURE.md... and more deployment documentation ...

````

### `/docs/testing/` - Test Coverage, CI/CD (9+ files)### `/docs/archive/troubleshooting/` - Resolved Issues (77+ files)

`bash`

AUTHENTICATION-SERVICE-TESTS-SUMMARY.mdADMIN-ACCESS-FIX.md

COVERAGE_ACHIEVEMENT_SUMMARY.mdCSRF-FIX-SUMMARY.md

CI-CD-STATUS.md403-GITHUB-ISSUES-ERROR.md

TEST-COVERAGE-SUMMARY.md... and more historical troubleshooting ...

````



### `/docs/deployment/` - Deployment, Release (3+ files)---



```bash## Implementation Checklist

PRODUCTION-DEPLOYMENT-GUIDE.md

DEPLOYMENT-SUCCESS.mdWhen implementing file organization:

RELEASE-NOTES-v1.0.md

```- [ ] Understand the 4 protected files that stay in root

- [ ] Know which configs are standard (stay in root) vs variants (go to /config/)

### `/docs/archive/troubleshooting/` - Resolved Issues (77+ files)- [ ] Recognize guide/tutorial keywords → `/docs/guides/`

- [ ] Recognize feature/spec keywords → `/docs/features/`

```bash- [ ] Recognize test/quality keywords → `/docs/testing/`

ADMIN-ACCESS-FIX.md- [ ] Recognize deployment/release keywords → `/docs/deployment/`

CSRF-FIX-SUMMARY.md- [ ] Recognize resolved issue keywords → `/docs/archive/troubleshooting/`

403-GITHUB-ISSUES-ERROR.md- [ ] Follow naming conventions (kebab-case, descriptive, UPPERCASE)

```- [ ] Use decision tree when unsure

- [ ] Ask clarifying questions for edge cases

---- [ ] Allow user overrides when specified

- [ ] Maintain directory structure integrity

## Implementation Checklist- [ ] Regular compliance verification



When implementing file organization:---



- [ ] Understand the 4 protected files that stay in root## Quality Standards

- [ ] Know which configs are standard (stay in root) vs variants (go to /config/)

- [ ] Recognize guide/tutorial keywords → `/docs/guides/`### Files Created Must Meet These Standards

- [ ] Recognize feature/spec keywords → `/docs/features/`

- [ ] Recognize test/quality keywords → `/docs/testing/`1. **Correct Location** ✓

- [ ] Recognize deployment/release keywords → `/docs/deployment/`   - File placed in appropriate subdirectory

- [ ] Recognize resolved issue keywords → `/docs/archive/troubleshooting/`   - Not in root (except 4 protected files)

- [ ] Follow naming conventions (kebab-case, descriptive, UPPERCASE)   - Follows decision tree logic

- [ ] Use decision tree when unsure

- [ ] Ask clarifying questions for edge cases2. **Proper Naming** ✓

- [ ] Allow user overrides when specified   - Uses kebab-case or underscore-case

- [ ] Maintain directory structure integrity   - Descriptive and clear

- [ ] Regular compliance verification   - Follows pattern conventions



---3. **Clear Purpose** ✓

   - Filename clearly indicates file purpose

## Quality Standards   - Content matches directory category

   - No ambiguity about what file contains

### Files Created Must Meet These Standards

4. **Organized Structure** ✓

1. **Correct Location** ✓   - If document, has clear heading structure

   - File placed in appropriate subdirectory   - If code, properly formatted and linted

   - Not in root (except 4 protected files)   - Consistent with other similar files

   - Follows decision tree logic

5. **References Updated** ✓

2. **Proper Naming** ✓   - Links and imports point to correct location

   - Uses kebab-case or underscore-case   - Documentation references updated

   - Descriptive and clear   - No broken paths

   - Follows pattern conventions

---

3. **Clear Purpose** ✓

   - Filename clearly indicates file purpose## Rapid Reference - File Type → Location

   - Content matches directory category

   - No ambiguity about what file contains| File Type | Characteristics | Location | Example |

|-----------|-----------------|----------|---------|

4. **Organized Structure** ✓| Setup Guide | "how-to", "setup", "install", "configure" | `/docs/guides/` | `SETUP-ENVIRONMENT.md` |

   - If document, has clear heading structure| How-To Guide | "debug", "troubleshoot", "tutorial" | `/docs/guides/` | `DEBUG_SERVICE_GUIDE.md` |

   - If code, properly formatted and linted| Feature Spec | "feature", "implementation", "architecture" | `/docs/features/` | `ANGULAR_SIGNALS_MIGRATION.md` |

   - Consistent with other similar files| Component Design | "component", "design", "schema" | `/docs/features/` | `COMPONENT-ARCHITECTURE.md` |

| Test Report | "test", "coverage", "quality" | `/docs/testing/` | `TEST-COVERAGE-SUMMARY.md` |

5. **References Updated** ✓| CI/CD Status | "ci/cd", "build", "status" | `/docs/testing/` | `CI-CD-STATUS.md` |

   - Links and imports point to correct location| Deployment Guide | "deployment", "production", "release" | `/docs/deployment/` | `DEPLOYMENT-GUIDE.md` |

   - Documentation references updated| Release Notes | "release", "changelog", "notes" | `/docs/deployment/` | `RELEASE-NOTES-v1.0.md` |

   - No broken paths| Resolved Issue | "fix", "issue", "bug", "resolved" | `/docs/archive/troubleshooting/` | `ADMIN-ACCESS-FIX.md` |

| Config Variant | `.config.js`, `.config.ts`, `.babelrc` | `/config/` | `jest-fast.config.ts` |

---| Application Code | `.ts`, `.js` component/service | `/src/` | `device.service.ts` |

| Script File | `.sh`, `.js`, automation | `/scripts/` | `build.sh` |

## Rapid Reference - File Type → Location

---

| File Type | Characteristics | Location | Example |

|-----------|-----------------|----------|---------|## For GitHub Copilot Implementation

| Setup Guide | "how-to", "setup", "install", "configure" | `/docs/guides/` | `SETUP-ENVIRONMENT.md` |

| How-To Guide | "debug", "troubleshoot", "tutorial" | `/docs/guides/` | `DEBUG_SERVICE_GUIDE.md` |### Instructions for Copilot AI

| Feature Spec | "feature", "implementation", "architecture" | `/docs/features/` | `ANGULAR_SIGNALS_MIGRATION.md` |

| Component Design | "component", "design", "schema" | `/docs/features/` | `COMPONENT-ARCHITECTURE.md` |When you are asked to create ANY new file in the 3d-inventory-ui project:

| Test Report | "test", "coverage", "quality" | `/docs/testing/` | `TEST-COVERAGE-SUMMARY.md` |

| CI/CD Status | "ci/cd", "build", "status" | `/docs/testing/` | `CI-CD-STATUS.md` |1. **ALWAYS check location first** - Apply the decision tree above

| Deployment Guide | "deployment", "production", "release" | `/docs/deployment/` | `DEPLOYMENT-GUIDE.md` |2. **CONFIRM intended location** - Ask user if unsure

| Release Notes | "release", "changelog", "notes" | `/docs/deployment/` | `RELEASE-NOTES-v1.0.md` |3. **CREATE in correct directory** - Don't create in root unless absolutely required

| Resolved Issue | "fix", "issue", "bug", "resolved" | `/docs/archive/troubleshooting/` | `ADMIN-ACCESS-FIX.md` |4. **VERIFY path correctness** - Double-check the full path before creation

| Config Variant | `.config.js`, `.config.ts`, `.babelrc` | `/config/` | `jest-fast.config.ts` |5. **USE proper naming** - Follow naming conventions for the file type

| Application Code | `.ts`, `.js` component/service | `/src/` | `device.service.ts` |6. **MAINTAIN structure** - Ensure directory exists or create it

| Script File | `.sh`, `.js`, automation | `/scripts/` | `build.sh` |7. **UPDATE references** - If needed, update import paths or links

8. **REPORT success** - Confirm file created with full path

---

### Red Flags to Prevent

## For GitHub Copilot Implementation

🚫 Don't create `.md` files in root (except 4 protected)

### Instructions for Copilot AI🚫 Don't create config variants in root (use `/config/`)

🚫 Don't create all guides/features in `/docs/` root

When you are asked to create ANY new file in the 3d-inventory-ui project:🚫 Don't mix file purposes (each file has one primary category)

🚫 Don't use CamelCase for filenames (use kebab-case)

1. **ALWAYS check location first** - Apply the decision tree above🚫 Don't skip the decision tree (always verify location)

2. **CONFIRM intended location** - Ask user if unsure🚫 Don't create files without confirming location with user

3. **CREATE in correct directory** - Don't create in root unless absolutely required

4. **VERIFY path correctness** - Double-check the full path before creation### Success Indicators

5. **USE proper naming** - Follow naming conventions for the file type

6. **MAINTAIN structure** - Ensure directory exists or create it✅ File created in correct subdirectory

7. **UPDATE references** - If needed, update import paths or links✅ Filename follows naming conventions

8. **REPORT success** - Confirm file created with full path✅ No files added to root (except when absolutely required)

✅ Directory structure maintained and verified

### Red Flags to Prevent✅ References and imports point to correct location

✅ User confirmation of placement

🚫 Don't create `.md` files in root (except 4 protected)

🚫 Don't create config variants in root (use `/config/`)---

🚫 Don't create all guides/features in `/docs/` root

🚫 Don't mix file purposes (each file has one primary category)**Version**: 1.0

🚫 Don't use CamelCase for filenames (use kebab-case)**Last Updated**: November 12, 2025

🚫 Don't skip the decision tree (always verify location)**Scope**: 3d-inventory-ui project

🚫 Don't create files without confirming location with user**Applies To**: All `.md`, `.sh`, `.js`, `.ts` file creation

**Compliance**: 100% - Prevents root directory sprawl, maintains organization, enables easy navigation

### Success Indicators

✅ File created in correct subdirectory
✅ Filename follows naming conventions
✅ No files added to root (except when absolutely required)
✅ Directory structure maintained and verified
✅ References and imports point to correct location
✅ User confirmation of placement

---

**Version**: 1.0
**Last Updated**: November 12, 2025
**Scope**: 3d-inventory-ui project
**Applies To**: All `.md`, `.sh`, `.js`, `.ts` file creation
**Compliance**: 100% - Prevents root directory sprawl, maintains organization, enables easy navigation
````
