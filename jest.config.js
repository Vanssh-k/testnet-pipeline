const coverageToNumber = 80 // [0..100]
const coverageBranches = 50

// Or async function
module.exports = async () => {
    return {
        verbose: true,
        rootDir: './',
        clearMocks: true, // clear mocks before every test
        resetMocks: false, // reset mock state before every test
        testMatch: [
            '<rootDir>/controller/**/*.test.js',
            // '<rootDir>/**/*.spec.js',        // Removing cache test cases for github actions
            '<rootDir>/**/*.test.js',
        ], // match only tests inside /tests folder
        testPathIgnorePatterns: [
            '<rootDir>/node_modules/',
            '<rootDir>/.trunk/',
        ], // exclude unnecessary folders

        // following lines are about coverage
        collectCoverage: true, // [true|false]
        collectCoverageFrom: ['<rootDir>/controller/**/*.js'],
        coverageDirectory: '<rootDir>/coverage',
        coverageReporters: ['lcov'],
        coverageThreshold: {
            global: {
                branches: coverageBranches,
                functions: coverageToNumber,
                lines: coverageToNumber,
                statements: coverageToNumber,
            },
        },
    }
}
