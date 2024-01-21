/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/handlers/__tests__",
    "<rootDir>/src/modules/__tests__",
    "<rootDir>/src/__tests__/setup",
    "<rootDir>/src/__tests__/dbSetup",
  ],
};
