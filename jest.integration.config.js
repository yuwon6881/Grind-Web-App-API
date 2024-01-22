/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  globalSetup: "<rootDir>/src/__tests__/setup.ts",
  globalTeardown: "<rootDir>/src/__tests__/teardown.ts",
  setupFilesAfterEnv: [
    "<rootDir>/src/__tests__/beforeEach.ts",
    "<rootDir>/src/__tests__/afterEach.ts",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/handlers/__tests__",
    "<rootDir>/src/modules/__tests__",
    "<rootDir>/src/__tests__/setup",
    "<rootDir>/src/__tests__/beforeEach",
    "<rootDir>/src/__tests__/testData",
    "<rootDir>/src/__tests__/teardown.ts",
    "<rootDir>/src/__tests__/afterEach.ts",
  ],
};
