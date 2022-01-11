// having this singleton relieves modules from needing to import index.tsx
// noinspection PointlessBooleanExpressionJS

import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";
import { Firestore, getFirestore } from "firebase/firestore";
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from "firebase/functions";
import { FirebasePerformance, getPerformance } from "firebase/performance";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  BUCKET_URL,
  MEASUREMENT_ID,
  PROJECT_ID,
} from "secrets";

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

const app = initializeApp(OPTIONS);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);
const performance = getPerformance(app);

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
};
export const FIREBASE: FirebaseSuite = Object.freeze({
  analytics,
  app,
  auth,
  db,
  firestore,
  functions,
  performance,
});
