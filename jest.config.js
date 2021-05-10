// import type { Config } from "@jest/types";

// @debt make this work as a .ts

/**
 * Promise style Jest config (in case we need to use other promises here in future)
 *
 * @see https://jestjs.io/docs/en/configuration
 */
// export default async (): Promise<Config.InitialOptions> => {
module.exports = async () => {
  return {
    rootDir: ".",
    roots: ["<rootDir>", "<rootDir>/src"],
    verbose: true,
    maxWorkers: "50%",

    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],

    // @debt make these work to actually ignore the paths we want
    // testPathIgnorePatterns: ["/node_modules/", "<rootDir>/cypress/.*"],
    // transformIgnorePatterns: ["/node_modules/", "<rootDir>/cypress/.*"],

    // transform: {
    //   "^.+\\.(ts|tsx)$": "ts-jest",
    // },
  };
};
