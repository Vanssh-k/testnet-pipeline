const coverageToNumber = 90; // [0..100]

// Or async function
module.exports = async () => {
  return {
    verbose: true,
    rootDir: "./",
    clearMocks: true, // clear mocks before every test
    resetMocks: false, // reset mock state before every test
    testMatch: ["<rootDir>/controller/**/*.test.js"], // match only tests inside /tests folder
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.trunk/"], // exclude unnecessary folders

    // following lines are about coverage
    collectCoverage: true, //[true|false]
    collectCoverageFrom: ["<rootDir>/controller/**/*.js"],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["lcov"],
    coverageThreshold: {
      global: {
        branches: coverageToNumber,
        functions: coverageToNumber,
        lines: coverageToNumber,
        statements: coverageToNumber,
      },
    },
  };
};
