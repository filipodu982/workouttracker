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
      '\\.css$': '<rootDir>/src/__mocks__/styleMock.js',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js'
    },
    verbose: true,
    clearMocks: true,
    coverageDirectory: 'coverage',
    transformIgnorePatterns: [
      '/node_modules/(?!(@testing-library|nanoid)/)'
    ]
  };