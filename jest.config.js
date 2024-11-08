/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/singleton.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/handlers/__tests__/mocks.ts",
    "<rootDir>/src/handlers/__tests__/mockData.ts",
    "<rootDir>/src/__tests__",
  ],
};
