// jest.config.js
/**
 * Jest configuration for testing the Lift Logger application
 */
module.exports = {
    rootDir: '.',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.js',
      '!src/reportWebVitals.js',
      '!src/**/*.d.ts',
      '!src/mocks/**'
    ],
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    watchPathIgnorePatterns: ['node_modules'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    },
    verbose: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    transformIgnorePatterns: [
      '/node_modules/(?!(@testing-library|nanoid)/)'
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    coverageReporters: ['lcov', 'text', 'text-summary'],
  };