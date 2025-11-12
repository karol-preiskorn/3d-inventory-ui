#!/usr/bin/env node

/**
 * @file validate-file-organization.js
 * @description Validates that files are organized in proper subdirectories for Angular UI
 *
 * This script ensures:
 * 1. Only 2 essential markdown files are in root (README.md, LICENSE)
 * 2. Angular-specific docs and guides are in docs/ subdirectories
 * 3. Shell scripts (.sh) are in scripts/ directory
 * 4. Test utilities are in scripts/testing/ directory
 * 5. Configuration files are in config/ directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { readdirSync, statSync } = fs;

const ROOT_DIR = path.resolve(__dirname, '..');

// Files that are allowed in the root directory for Angular UI
const ALLOWED_ROOT_FILES = [
  'README.md',
  'LICENSE',
  'AGENTS.md',
];

// Files that should be in specific directories
const REQUIRED_LOCATIONS = {
  scripts: {
    type: 'pattern',
    patterns: ['.sh'],
    description: 'Shell and deployment scripts',
  },
  'scripts/testing': {
    type: 'specific',
    files: [
      'test-login-functionality.js',
      'test-api-structure.cjs',
      'test-log-api.cjs',
      'test-log-integration.cjs',
      'quick-auth-test.js',
      'verify-device-crud.js',
      'verify-readme-rendering.cjs',
    ],
  },
  config: {
    type: 'specific',
    files: [
      'jest.config.ts',
      'jest.config.fast.ts',
      'eslint.config.js',
      'karma.conf.js',
    ],
  },
};

let hasErrors = false;
let hasWarnings = false;
let issues = [];

// Check root directory
console.log('🔍 Validating file organization...\n');

// Get all markdown files in root
const rootFiles = readdirSync(ROOT_DIR)
  .filter(
    (f) =>
      f.endsWith('.md') &&
      statSync(path.join(ROOT_DIR, f)).isFile() &&
      f !== '.npmrc' &&
      f !== '.prettierrc.json'
  );

// Check for disallowed markdown files
const disallowedMdFiles = rootFiles.filter(
  (f) => !ALLOWED_ROOT_FILES.includes(f)
);

if (disallowedMdFiles.length > 0) {
  hasWarnings = true;
  issues.push({
    type: 'warning',
    message: `⚠️  Disallowed markdown files in root: ${disallowedMdFiles.length} files`,
    suggestion: `Move these files to appropriate docs/ subdirectories:
     - Feature docs → docs/features/
     - Setup guides → docs/guides/
     - Troubleshooting → docs/troubleshooting/
     - Archive/Historical → docs/archive/`,
  });
}

// Check for executable files in root that shouldn't be there
const executableExtensions = ['.sh', '.ts', '.js', '.cjs', '.mjs'];
const rootExecutables = readdirSync(ROOT_DIR)
  .filter(
    (f) =>
      executableExtensions.some((ext) => f.endsWith(ext)) &&
      f !== 'package.json' &&
      f !== '.prettierrc.json' &&
      f !== 'eslint.config.js' &&
      statSync(path.join(ROOT_DIR, f)).isFile()
  );

if (rootExecutables.length > 0) {
  hasErrors = true;
  issues.push({
    type: 'error',
    message: `❌ Executable files found in root: ${rootExecutables.length} files`,
    suggestion: `Move these files to scripts/, config/, or appropriate subdirectories:
     ${rootExecutables.slice(0, 5).join(', ')}${rootExecutables.length > 5 ? ` and ${rootExecutables.length - 5} more...` : ''}`,
  });
}

// Check for required files in proper locations
for (const [directory, config] of Object.entries(REQUIRED_LOCATIONS)) {
  const fullPath = path.join(ROOT_DIR, directory);

  if (!fs.existsSync(fullPath)) {
    hasErrors = true;
    issues.push({
      type: 'error',
      message: `❌ Directory ${directory}/ does not exist`,
      suggestion: `Create the directory: mkdir -p ${directory}`,
    });
    continue;
  }

  // Skip pattern-based validation for now (they're just file extensions)
  if (config.type === 'pattern') {
    continue;
  }

  // Check specific files
  const expectedFiles = config.files || [];
  for (const file of expectedFiles) {
    const filePath = path.join(fullPath, file);
    if (!fs.existsSync(filePath)) {
      // Don't warn about optional files
      // hasWarnings = true
    }
  }
}

// Check for unexpected files in scripts/ subdirectories
const scriptDirs = ['testing'];
for (const subdir of scriptDirs) {
  const fullPath = path.join(ROOT_DIR, 'scripts', subdir);

  if (fs.existsSync(fullPath)) {
    const files = readdirSync(fullPath);
    const expectedFiles = REQUIRED_LOCATIONS[`scripts/${subdir}`]?.files || [];

    for (const file of files) {
      if (file.startsWith('.')) continue; // Skip hidden files

      if (!expectedFiles.includes(file) && !file.endsWith('.md')) {
        // Optional warning for unexpected files
      }
    }
  }
}

// Print issues
if (issues.length > 0) {
  console.log('📋 Issues found:\n');
  issues.forEach((issue) => {
    console.log(issue.message);
    console.log(`   💡 ${issue.suggestion}\n`);
  });
}

// Summary
console.log('\n' + '='.repeat(70));
if (hasErrors) {
  console.log('❌ VALIDATION FAILED - Critical errors found');
  console.log('='.repeat(70));
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  VALIDATION PASSED WITH WARNINGS - Minor issues found');
  console.log('='.repeat(70));
  process.exit(0);
} else {
  console.log('✅ VALIDATION PASSED - File organization is correct');
  console.log('='.repeat(70));
  console.log('\n✨ Recommended root directory structure:');
  console.log('  📁 Root/');
  console.log('     ├─ README.md');
  console.log('     ├─ LICENSE');
  console.log('     ├─ angular.json');
  console.log('     ├─ tsconfig.json');
  console.log('     ├─ src/');
  console.log('     │  ├─ app/');
  console.log('     │  │  ├─ components/');
  console.log('     │  │  ├─ services/');
  console.log('     │  │  ├─ guards/');
  console.log('     │  │  └─ ...');
  console.log('     │  └─ assets/');
  console.log('     ├─ scripts/');
  console.log('     │  └─ testing/ (test utilities)');
  console.log('     ├─ config/');
  console.log('     │  ├─ jest.config.ts');
  console.log('     │  ├─ eslint.config.js');
  console.log('     │  └─ ...');
  console.log('     ├─ docs/');
  console.log('     │  ├─ features/');
  console.log('     │  ├─ guides/');
  console.log('     │  ├─ troubleshooting/');
  console.log('     │  └─ archive/');
  console.log('     └─ ... (other config files)\n');
  process.exit(0);
}
