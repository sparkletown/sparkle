import firebase from "firebase";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import * as _auth from "./auth.js";
import * as _access from "./access";
import * as _stats from "./stats";
import * as _venue from "./venue";
import * as _video from "./video";
import * as _scheduled from "./scheduled";
import * as _world from "./world";

import "firebase/firestore";

const functionsConfig = functions.config();

if (!functionsConfig) throw new Error("failed: functionsConfig missing");
if (!functionsConfig.project)
  throw new Error("failed: functionsConfig.project missing");
if (!functionsConfig.project.id)
  throw new Error("failed: functionsConfig.project.id missing");

const firebaseConfig = {
  projectId: functionsConfig.project.id,
};
firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  ...firebaseConfig,
  credential: admin.credential.cert({
    ...functionsConfig.service_account,
    private_key: functionsConfig.service_account.private_key.replace(
      /\\n/g,
      "\n"
    ),
  }),
});

export const access = _access;
export const auth = _auth;
export const stats = _stats;
export const venue = _venue;
export const video = _video;
export const scheduled = _scheduled;
export const world = _world;

// @debt Refactor this into ./auth if this is still used/needed, otherwise remove it
//   It doesn't look like anything calls it in the codebase currently?
export const checkPassword = functions.https.onCall(async (data) => {
  await firebase
    .firestore()
    .doc(`venues/${data.venue}`)
    .get()
    .then((doc) => {
      if (
        doc &&
        doc.exists &&
        doc.data() &&
        doc.data()?.password &&
        _auth.passwordsMatch(data.password, doc.data()?.password)
      ) {
        return "OK";
      }
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Password incorrect"
      );
    });
});
