// having this singleton relieves modules from needing to import index.tsx
// noinspection PointlessBooleanExpressionJS

import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { Database, getDatabase } from "firebase/database";
import { Firestore, getFirestore } from "firebase/firestore";
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from "firebase/functions";
import { FirebasePerformance, getPerformance } from "firebase/performance";
import { FirebaseStorage, getStorage } from "firebase/storage";

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

const OPTIONS: FirebaseOptions = {
  apiKey: API_KEY,
  appId: APP_ID,
  authDomain: AUTH_DOMAIN,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

// const SETTINGS: FirebaseAppSettings = {
//   name: undefined,
//   automaticDataCollectionEnabled: undefined,
// };

// use of SDKv8 init is needed for the compat mode
const firebaseApp = firebase.initializeApp(OPTIONS);
// old style inits of DB and auth, useful for the transition period
firebaseApp.firestore();
firebaseApp.auth();
// firebaseApp.analytics();
// firebase.functions();
// firebase.performance();

// the new and improved v9 API creates separate instance from the one above
// const app = initializeApp(OPTIONS);
// so, just rely on the old one for the time being
const app = firebaseApp;

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);
const performance = getPerformance(app);
const storage = getStorage(app);

// Enable the functions emulator when running in development
if (process.env.NODE_ENV === "development") {
  const host = "localhost";
  connectFunctionsEmulator(functions, host, 5001);
  // connectFirestoreEmulator(firestore, host, 9000);
}

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
