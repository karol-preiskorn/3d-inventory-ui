/**
 * Jest configuration for Angular testing with TestBed support
 * @type {import('jest').Config}
 */

const config: import('jest').Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 15000, // Reduced timeout for faster failure detection
  verbose: false, // Reduced verbosity for performance
  silent: false,

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/test-setup.ts',
    '!src/**/*.module.ts',
    '!src/**/*.routing.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },

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
    'node_modules/(?!(@angular|@ngrx|ngx-pagination|rxjs|tslib|zone.js|@ng-bootstrap|uuid|@faker-js)/.*)'
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
  workerIdleMemoryLimit: '1GB',
  cacheDirectory: '<rootDir>/.jest-cache',
  clearMocks: true,
  restoreMocks: true,

  // Faster test execution
  detectOpenHandles: false,
  forceExit: true
};

export default config;
