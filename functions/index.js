const firebase = require("firebase");
const admin = require("firebase-admin");

require("firebase/firestore");
const functions = require("firebase-functions");

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

const access = require("./access");
const auth = require("./auth");
const stats = require("./stats");
const venue = require("./venue");
const video = require("./video");
const scheduled = require("./scheduled");
const world = require("./world");
const triggered = require("./triggered");

exports.access = access;
exports.auth = auth;
exports.stats = stats;
exports.venue = venue;
exports.video = video;
exports.scheduled = scheduled;
exports.world = world;
exports.triggered = triggered;
