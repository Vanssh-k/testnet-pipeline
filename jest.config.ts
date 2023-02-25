const coverageToNumber = 80 // [0..100]

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    verbose: true,
    rootDir: './',
    clearMocks: true, // clear mocks before every test
    resetMocks: false, // reset mock state before every test
    testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'], // match only tests inside /tests folder
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.trunk/',
        '<rootDir>/Commands/',
    ], // exclude unnecessary folders

    // following lines are about coverage
    collectCoverage: true, //[true|false]
    collectCoverageFrom: ['<rootDir>/src/Lighthouse/**/*.ts'],
    coverageDirectory: '<rootDir>/src/coverage',
    coverageReporters: ['lcov'],
    coverageThreshold: {
        global: {
            branches: coverageToNumber,
            functions: coverageToNumber,
            lines: coverageToNumber,
            statements: coverageToNumber,
        },
    },
}
