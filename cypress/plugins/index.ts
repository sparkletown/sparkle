import * as dotenv from "dotenv";

// @debt There should always only be .env, no other files for environment setup
// @see https://github.com/motdotla/dotenv#should-i-have-multiple-env-files
// @see https://12factor.net/config
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env", override: true });

/**
 * This function is called when a project is opened or re-opened
 * (e.g. due to the project's config changing).
 *
 * @see https://on.cypress.io/plugins-guide
 *
 * @param on -  is used to hook into various events Cypress emits
 * @param config - `config` is the resolved Cypress config
 */
const configure: Cypress.PluginConfig = (on, config) => {
  const baseUrl = process.env.CYPRESS_BASE_URL;
  console.log("Setting baseUrl to be", baseUrl, "instead of", config.baseUrl);
  config.baseUrl = baseUrl ?? null;

  return config;
};

// @see https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
export = configure;
