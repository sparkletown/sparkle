// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// @debt There should always only be .env, no other files for environment setup
// @see https://github.com/motdotla/dotenv#should-i-have-multiple-env-files
// @see https://12factor.net/config
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env", override: true });

// This function is called when a project is opened or re-opened
// (e.g. due to the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const baseUrl = process.env.CYPRESS_BASE_URL;
  console.log("Setting baseUrl to be", baseUrl, "instead of", config.baseUrl);
  config.baseUrl = baseUrl;
  
  return config;
};
