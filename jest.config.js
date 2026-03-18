/** @type {import('jest').Config} */
process.env.NODE_ENV = 'test';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/scripts/config/$1',
    '^@utils/(.*)$': '<rootDir>/scripts/utils/$1',
    '^@types-local/(.*)$': '<rootDir>/scripts/types/$1',
    '^@integrations/(.*)$': '<rootDir>/scripts/integrations/$1',
    '^@services/(.*)$': '<rootDir>/scripts/services/$1',
  },
  collectCoverageFrom: [
    'scripts/**/*.ts',
    '!scripts/cli/index.ts',
  ],
  coverageThreshold: {
    global: { lines: 70 },
  },
};
