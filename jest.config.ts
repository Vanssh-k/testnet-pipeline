import dotenv from 'dotenv'
dotenv.config()

export default {
  verbose: true,
  rootDir: './',
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 85,
      lines: 80,
      statements: 90,
    },
  },
}
