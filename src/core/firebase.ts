// having this singleton relieves modules from needing to import index.tsx
// noinspection PointlessBooleanExpressionJS

import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { Database, getDatabase } from "firebase/database";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from "firebase/functions";
import { FirebasePerformance, getPerformance } from "firebase/performance";
import {
  connectStorageEmulator,
  FirebaseStorage,
  getStorage,
} from "firebase/storage";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  BUCKET_URL,
  MEASUREMENT_ID,
  PROJECT_ID,
} from "secrets";

import "firebase/compat/auth";
import "firebase/compat/firestore";

// read configuration from environment and/or set emulator defaults
const ENV = process.env.NODE_ENV;
const PROTOCOL = process.env.REACT_APP_FIRE_EMULATE_PROTOCOL || `http`;
const HOST = process.env.REACT_APP_FIRE_EMULATE_HOST || "127.0.0.1";

const FLAGS = Object.freeze({
  emulateAll: !!process.env.REACT_APP_FIRE_EMULATE_ALL,
  emulateAuth: !!process.env.REACT_APP_FIRE_EMULATE_AUTH,
  emulateFunctions: !!process.env.REACT_APP_FIRE_EMULATE_FUNCTIONS,
  emulateFirestore: !!process.env.REACT_APP_FIRE_EMULATE_FIRESTORE,
  emulateStorage: !!process.env.REACT_APP_FIRE_EMULATE_STORAGE,
});

// NOTE: make sure these match the ports in firebase.json or their overrides if provided through other means
const PORTS = Object.freeze({
  auth: 9099,
  firestore: 8080,
  functions: 5001,
  storage: 9199,
});

const OPTIONS: FirebaseOptions = {
  apiKey: API_KEY,
  appId: APP_ID,
  authDomain: AUTH_DOMAIN,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

// @debt use of SDKv8 init is needed for the compat mode, replace this one with the one that follows
const firebaseApp = firebase.initializeApp(OPTIONS);
// old style inits of DB and auth, useful for the transition period
firebaseApp.firestore();
firebaseApp.auth();
const app = firebaseApp;

// the new and improved v9 API creates separate instance from the one above
// so, just rely on the old one until all firebase/compat imports are cleared out
//
// const SETTINGS: FirebaseAppSettings = {
//   name: undefined, // if no custom name set, defaults to "[DEFAULT]"
//   automaticDataCollectionEnabled: undefined, // flag for GDPR opt-in/opt-out
// };
//
// const app = initializeApp(OPTIONS, SETTINGS);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);
const performance = getPerformance(app);
const storage = getStorage(app);

type FirebaseSuite = {
  app: FirebaseApp;
  analytics: Analytics;
  auth: Auth;
  db: Database;
  firestore: Firestore;
  functions: Functions;
  performance: FirebasePerformance;
  storage: FirebaseStorage;
  flags: typeof FLAGS;
  ports: typeof PORTS;
};

export const FIREBASE: FirebaseSuite = Object.freeze({
  analytics,
  app,
  auth,
  db,
  firestore,
  functions,
  performance,
  storage,
  flags: FLAGS,
  ports: PORTS,
});

// to keep the old behavior, emulate functions even if NODE_ENV is development
if (FLAGS.emulateAll || FLAGS.emulateFunctions || ENV === "development") {
  console.log(`Using functions emulator at ${HOST}:${PORTS.functions}`);
  connectFunctionsEmulator(functions, HOST, PORTS.functions);
}

if (FLAGS.emulateAll || FLAGS.emulateFirestore) {
  console.log(`Using Firestore emulator at ${HOST}:${PORTS.firestore}`);
  connectFirestoreEmulator(firestore, HOST, PORTS.firestore);
}

if (FLAGS.emulateAll || FLAGS.emulateAuth) {
  const url = `${PROTOCOL}://${HOST}:${PORTS.auth}`;
  console.log("Using auth emulator at", url);
  connectAuthEmulator(auth, url);
}

if (FLAGS.emulateAll || FLAGS.emulateStorage) {
  console.log(`Using storage emulator at ${HOST}:${PORTS.storage}`);
  connectStorageEmulator(storage, HOST, PORTS.storage);
}
