export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testMatch: [
    "**/tests/*.test.ts",
    "**/tests/*.test.tsx",
    "**/tests/*.test.js",
    "**/tests/*.test.jsx",
  ],
};
