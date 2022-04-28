export const PROJECT_ID = process.env.REACT_APP_PROJECT_ID;
export const API_KEY = process.env.REACT_APP_API_KEY;
export const APP_ID = process.env.REACT_APP_APP_ID;
export const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN;
export const MEASUREMENT_ID = process.env.REACT_APP_MEASUREMENT_ID;
export const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;
export const BUGSNAG_API_KEY = process.env.REACT_APP_BUGSNAG_API_KEY;
export const LOGROCKET_APP_ID = process.env.REACT_APP_LOGROCKET_APP_ID;
export const MIXPANEL_PROJECT_TOKEN =
  process.env.REACT_APP_MIXPANEL_PROJECT_TOKEN;
export const ALGOLIA_API_SEARCH_KEY =
  process.env.REACT_APP_ALGOLIA_API_SEARCH_KEY;
export const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;

// Build environment data from CI
export const BUILD_SHA1 = process.env.REACT_APP_BUILD_SHA1 || undefined;
export const BUILD_TAG = process.env.REACT_APP_BUILD_TAG || undefined;
export const BUILD_BRANCH = process.env.REACT_APP_BUILD_BRANCH || undefined;

export const BUILD_REPOSITORY_URL =
  process.env.REACT_APP_BUILD_REPOSITORY_URL || undefined;

export const BUILD_PULL_REQUESTS = (
  process.env.REACT_APP_BUILD_PULL_REQUESTS || ""
)
  .split(",")
  .filter((s) => !!s);

// read configuration from environment and/or set emulator defaults
export const ENV = process.env.NODE_ENV;
export const PROTOCOL = process.env.REACT_APP_FIRE_EMULATE_PROTOCOL || `http`;
export const HOST = process.env.REACT_APP_FIRE_EMULATE_HOST || "127.0.0.1";
export const PORT = process.env.PORT || 3000;
export const CY = !!((window as unknown) as { Cypress: unknown }).Cypress;

export const FLAGS = Object.freeze({
  emulateAll: !!process.env.REACT_APP_FIRE_EMULATE_ALL,
  emulateAuth: !!process.env.REACT_APP_FIRE_EMULATE_AUTH,
  emulateFunctions: !!process.env.REACT_APP_FIRE_EMULATE_FUNCTIONS,
  emulateFirestore: !!process.env.REACT_APP_FIRE_EMULATE_FIRESTORE,
  emulateStorage: !!process.env.REACT_APP_FIRE_EMULATE_STORAGE,
});

// NOTE: due to CRA import restrictions
// import fireConfig from "firebase.json" throws an error
// so try to keep the following ports same as fireConfig.emulators ones

export const PORTS = Object.freeze({
  auth: 9099,
  firestore: 8080,
  functions: 5001,
  hosting: 5000,
  hub: 4400,
  pubsub: 8085,
  storage: 9199,
  ui: 4000,
});
