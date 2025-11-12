#!/usr/bin/env node

/**
 * @file organize-ui-project.js
 * @description Automated file organization script for 3D Inventory UI project
 * 
 * This script organizes the UI project according to file-organization.instructions.md:
 * - Moves .sh scripts to /scripts/
 * - Moves test files to /scripts/testing/
 * - Moves config files to /config/
 * - Moves markdown documentation to docs/ subdirectories
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')

// File categorization
const FILE_CATEGORIES = {
  'shell-scripts': {
    dir: path.join(ROOT_DIR, 'scripts'),
    patterns: [/\.sh$/],
    excludePatterns: [],
  },
  'test-utilities': {
    dir: path.join(ROOT_DIR, 'scripts', 'testing'),
    patterns: [/test.*\.js$/, /test.*\.cjs$/, /test.*\.ts$/],
    includes: [
      'test-admin-access.sh',
      'test-api-structure.cjs',
      'test-log-api.cjs',
      'test-login-functionality.js',
      'extra-webpack.config.js',
    ],
  },
  'config-files': {
    dir: path.join(ROOT_DIR, 'config'),
    patterns: [
      /jest\.config\..*\.(ts|js)$/,
      /eslint\.config\.(ts|js)$/,
      /karma\.conf\.js$/,
      /webpack\.config\.js$/,
      /tsconfig.*\.json$/,
    ],
    includes: [
      'jest.config.ts',
      'jest.config.fast.ts',
      'eslint.config.js',
      'karma.conf.js',
      'webpack.config.js',
      'tsconfig.json',
    ],
  },
  'docs-features': {
    dir: path.join(ROOT_DIR, 'docs', 'features'),
    patterns: [/^[A-Z][A-Z0-9-]*-FEATURE.*\.md$/],
    keywords: ['FEATURE', 'COMPONENT', 'SERVICE'],
  },
  'docs-guides': {
    dir: path.join(ROOT_DIR, 'docs', 'guides'),
    patterns: [/^[A-Z][A-Z0-9-]*-GUIDE.*\.md$/],
    keywords: ['GUIDE', 'SETUP', 'INSTALL', 'INSTALL', 'README', 'QUICK', 'REFERENCE'],
  },
  'docs-troubleshooting': {
    dir: path.join(ROOT_DIR, 'docs', 'troubleshooting'),
    patterns: [/^[A-Z][A-Z0-9-]*-ISSUE.*\.md$/, /^[A-Z][A-Z0-9-]*-ERROR.*\.md$/, /^[A-Z][A-Z0-9-]*-FIX.*\.md$/],
    keywords: ['ERROR', 'ISSUE', 'FIX', 'BUG', 'PROBLEM', 'TROUBLESHOOT', 'DEBUG'],
  },
  'docs-archive': {
    dir: path.join(ROOT_DIR, 'docs', 'archive'),
    patterns: [/^[A-Z][A-Z0-9-]*-ARCHIVE.*\.md$/, /^[A-Z][A-Z0-9-]*-DEPRECATED.*\.md$/],
    keywords: ['ARCHIVE', 'DEPRECATED', 'OLD', 'BACKUP', 'HISTORICAL'],
  },
}

// Files that MUST remain in root
const ALLOWED_ROOT_FILES = ['README.md', 'LICENSE', 'LICENSE.md', 'AGENTS.md', 'package.json', '.gitignore']

// Statistics
const stats = {
  moved: [],
  skipped: [],
  errors: [],
  total: 0,
}

/**
 * Create directory if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`📁 Created directory: ${path.relative(ROOT_DIR, dirPath)}`)
  }
}

/**
 * Categorize a file based on patterns and keywords
 */
function categorizeFile(filename) {
  // Check shell scripts
  if (FILE_CATEGORIES['shell-scripts'].patterns.some(p => p.test(filename))) {
    return 'shell-scripts'
  }

  // Check test utilities (by inclusion list or pattern)
  if (
    FILE_CATEGORIES['test-utilities'].includes.includes(filename) ||
    FILE_CATEGORIES['test-utilities'].patterns.some(p => p.test(filename))
  ) {
    return 'test-utilities'
  }

  // Check config files (by inclusion list or pattern)
  if (
    FILE_CATEGORIES['config-files'].includes.includes(filename) ||
    FILE_CATEGORIES['config-files'].patterns.some(p => p.test(filename))
  ) {
    return 'config-files'
  }

  // Check docs files (by keywords)
  if (filename.endsWith('.md')) {
    const upper = filename.toUpperCase()

    if (FILE_CATEGORIES['docs-troubleshooting'].keywords.some(k => upper.includes(k))) {
      return 'docs-troubleshooting'
    }

    if (FILE_CATEGORIES['docs-archive'].keywords.some(k => upper.includes(k))) {
      return 'docs-archive'
    }

    if (FILE_CATEGORIES['docs-guides'].keywords.some(k => upper.includes(k))) {
      return 'docs-guides'
    }

    if (FILE_CATEGORIES['docs-features'].keywords.some(k => upper.includes(k))) {
      return 'docs-features'
    }

    // Default: other markdown files go to archive for review
    return 'docs-archive'
  }

  return null
}

/**
 * Move file to appropriate directory
 */
function moveFile(filename, category) {
  const sourcePath = path.join(ROOT_DIR, filename)
  const targetDir = FILE_CATEGORIES[category].dir
  const targetPath = path.join(targetDir, filename)

  try {
    // Skip if already in correct location
    if (sourcePath === targetPath) {
      stats.skipped.push(filename)
      return
    }

    // Ensure target directory exists
    ensureDir(targetDir)

    // Move file
    fs.renameSync(sourcePath, targetPath)
    stats.moved.push({ file: filename, category, targetPath: path.relative(ROOT_DIR, targetPath) })
    console.log(`✅ Moved ${filename} → ${path.relative(ROOT_DIR, targetPath)}`)
  } catch (error) {
    stats.errors.push({ file: filename, error: error.message })
    console.error(`❌ Error moving ${filename}: ${error.message}`)
  }
}

/**
 * Main organization function
 */
function organizeProject() {
  console.log(`\n🚀 Starting UI project file organization...\n`)
  console.log(`📍 Project root: ${ROOT_DIR}\n`)

  // Get all files in root directory
  const files = fs.readdirSync(ROOT_DIR).filter(f => {
    const fullPath = path.join(ROOT_DIR, f)
    return fs.statSync(fullPath).isFile()
  })

  // Organize each file
  for (const file of files) {
    stats.total++

    // Skip allowed root files
    if (ALLOWED_ROOT_FILES.includes(file)) {
      stats.skipped.push(file)
      continue
    }

    // Categorize and move
    const category = categorizeFile(file)
    if (category) {
      moveFile(file, category)
    } else {
      stats.skipped.push(file)
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(70)}`)
  console.log(`📊 Organization Summary`)
  console.log(`${'='.repeat(70)}`)
  console.log(`Total files processed: ${stats.total}`)
  console.log(`✅ Moved: ${stats.moved.length}`)
  console.log(`⏭️  Skipped: ${stats.skipped.length}`)
  console.log(`❌ Errors: ${stats.errors.length}`)
  console.log(`${'='.repeat(70)}\n`)

  if (stats.moved.length > 0) {
    console.log(`📦 Files moved:`)
    stats.moved.forEach(m => {
      console.log(`   • ${m.file} → ${m.targetPath}`)
    })
    console.log()
  }

  if (stats.errors.length > 0) {
    console.log(`⚠️  Errors encountered:`)
    stats.errors.forEach(e => {
      console.log(`   • ${e.file}: ${e.error}`)
    })
    console.log()
  }

  // Final validation
  console.log(`\n🔍 Running validation after organization...\n`)
}

// Run organization
try {
  organizeProject()
  console.log(`✨ Organization complete! Run 'npm run check:file-organization' to verify.\n`)
} catch (error) {
  console.error(`\n❌ Fatal error during organization: ${error.message}\n`)
  process.exit(1)
}
