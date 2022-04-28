// having this singleton relieves modules from needing to import index.tsx
// noinspection PointlessBooleanExpressionJS

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  BUCKET_URL,
  CY,
  ENV,
  FLAGS,
  HOST,
  MEASUREMENT_ID,
  PORTS,
  PROJECT_ID,
  PROTOCOL,
} from "env";
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

import "firebase/compat/auth";
import "firebase/compat/firestore";

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
});

if (CY) {
  console.log("Running inside Cypress, connecting to emulators...");
  // NOTE: Cypress can't work with how Firestore long-polls requests, so there is a need for
  // each response from the backend to be closed immediately after the backend sends data
  // @see https://firebase.google.com/docs/reference/js/v8/firebase.firestore.Settings#experimentalautodetectlongpolling
  firebase.firestore().settings({
    experimentalAutoDetectLongPolling: true, // this should be set out of the box, but isn't
    // experimentalForceLongPolling: true, // exclusive with the one above
  });
}

// to keep the old behavior, emulate functions even if NODE_ENV is development
if (CY || FLAGS.emulateAll || FLAGS.emulateFunctions || ENV === "development") {
  console.log(`Using functions emulator at ${HOST}:${PORTS.functions}`);
  connectFunctionsEmulator(functions, HOST, PORTS.functions);
}

if (CY || FLAGS.emulateAll || FLAGS.emulateFirestore) {
  console.log(`Using Firestore emulator at ${HOST}:${PORTS.firestore}`);
  connectFirestoreEmulator(firestore, HOST, PORTS.firestore);
}

if (CY || FLAGS.emulateAll || FLAGS.emulateAuth) {
  const url = `${PROTOCOL}://${HOST}:${PORTS.auth}`;
  console.log("Using auth emulator at", url);
  connectAuthEmulator(auth, url);
}

if (CY || FLAGS.emulateAll || FLAGS.emulateStorage) {
  console.log(`Using storage emulator at ${HOST}:${PORTS.storage}`);
  connectStorageEmulator(storage, HOST, PORTS.storage);
}
