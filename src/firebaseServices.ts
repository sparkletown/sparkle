import { initializeAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions, ht } from "firebase/functions";
import { initializePerformance } from "firebase/performance";

import { FIREBASE_CONFIG } from "settings";

export const firebaseApp = initializeApp(FIREBASE_CONFIG);
export const analytics = initializeAnalytics(firebaseApp);
export const performance = initializePerformance(firebaseApp);
export const auth = initializeAuth(firebaseApp);
export const firestore = initializeFirestore(firebaseApp, {});

export const functions = getFunctions(firebaseApp);

// Enable the functions emulator when running in development
if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "http://localhost", 5001);
}
