/**
 * Fast Jest configuration for development testing
 * Optimized for performance during development
 */

const config: import('jest').Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 10000, // Faster timeout
  verbose: false,
  silent: false,

  // NO coverage for faster execution
  collectCoverage: false,

  // Test file patterns - include all tests
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).ts',
    '<rootDir>/src/**/*.(test|spec).ts'
  ],

  // Module resolution (handled by jest-preset-angular)
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  // Transform configuration for Angular (updated ts-jest config)
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },

  // Allow Angular modules to be transformed (optimized for performance)
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@ngrx|ngx-pagination|rxjs|tslib|zone.js|@ng-bootstrap|uuid)/.*)'
  ],

  // Module name mapping for Angular
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^src/environments/environment$': '<rootDir>/src/environments/environment.ts',
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js'
  },

  // Performance optimizations
  maxWorkers: '50%', // Use 50% of available cores
  workerIdleMemoryLimit: '512MB',
  cacheDirectory: '<rootDir>/.jest-cache',
  clearMocks: true,
  restoreMocks: true,

  // Faster test execution
  detectOpenHandles: false,
  forceExit: true
};

export default config;
