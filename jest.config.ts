/**
 * Jest configuration for Angular testing with TestBed support
 * @type {import('jest').Config}
 */

const config: import('jest').Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 30000,
  verbose: true,

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

  // Transform configuration for Angular (jest-preset-angular handles this)
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$'
    }
  },

  // Allow Angular modules to be transformed
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@ngrx|ngx-pagination|rxjs|tslib|zone.js)/.*)'
  ],

  // Module name mapping for Angular
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  }
};

export default config;
