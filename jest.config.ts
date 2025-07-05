/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 * @type {import('jest').Config}
 */

const config: import('jest').Config = {
  testTimeout: 30000,
  fakeTimers: {
    doNotFake: ['nextTick'],
    timerLimit: 30000,
  },
  bail: 1,
  verbose: true,
  coverageProvider: 'v8',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', ['text', { skipFull: true }]],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
  transformIgnorePatterns: ['node_modules/(?!@angular/core)'],
  projects: [
    {
      displayName: 'esLint',
      clearMocks: false,
      globals: {
        __DEV__: true,
      },
      moduleFileExtensions: ['ts', 'json'],
      runner: 'jest-runner-eslint',
      testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(mjs?|js?|tsx?|ts?)$',
      transform: {},
    },
    {
      displayName: 'prettier',
      clearMocks: true,
      globals: {
        __DEV__: true,
      },
      runner: 'prettier',
      testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
        '<rootDir>/docs/',
        '<rootDir>/logs/',
        '<rootDir>/coverage/',
      ],
      transform: {},
      moduleFileExtensions: ['js', 'ts', 'css', 'less', 'scss', 'html', 'json', 'graphql', 'md', 'yaml'],
      testMatch: [
        '**/*',
        '**/*.ts',
        '**/*.css',
        '**/*.less',
        '**/*.scss',
        '**/*.html',
        '**/*.json',
        '**/*.graphql',
        '**/*.md',
        '**/*.yaml',
      ],
    },
    {
      displayName: 'ts-jest',
      clearMocks: false,
      globals: {
        __DEV__: true,
      },
      moduleFileExtensions: ['js', 'ts', 'yaml', 'json', 'mjs'],
      preset: 'ts-jest',
      testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/docs/',
        '<rootDir>/dist/',
        '<rootDir>/logs/',
        '<rootDir>/coverage/',
      ],
      testRegex: '(/.*|(\\.|/)(test|spec))\\.(mjs?|cjs?|js?|tsx?|ts?)$',
      transform: {
        '^.+\\.ts?$': 'ts-jest',
        '^.+\\.mjs$': 'babel-jest',
      },
      transformIgnorePatterns: ['node_modules/(?!@angular/core)'],
    },
  ],
}
export default config
