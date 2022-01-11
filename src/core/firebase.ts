// having this singleton relieves modules from needing to import index.tsx

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getPerformance } from "firebase/performance";
import { createFirestoreInstance } from "redux-firestore";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  BUCKET_URL,
  MEASUREMENT_ID,
  PROJECT_ID,
} from "secrets";

import { store } from "store";

export const FIREBASE_CONFIG = {
  apiKey: API_KEY,
  appId: APP_ID,
  authDomain: AUTH_DOMAIN,
  measurementId: MEASUREMENT_ID,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_URL,
};

const app = initializeApp(FIREBASE_CONFIG);

const auth = getAuth(app);
const functions = getFunctions(app);
const db = getDatabase(app);
const firestore = getFirestore(app);

const analytics = getAnalytics(app);
const performance = getPerformance(app);

export const REACT_REDUX_FIREBASE_CONFIG = {
  firebase,
  config: {
    userProfile: "users",
    useFirestoreForProfile: true,
  },
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export const FIREBASE = Object.freeze({
  analytics,
  app,
  auth,
  db,
  firestore,
  functions,
  performance,
});
