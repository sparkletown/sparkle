const admin = require("firebase-admin");

const functions = require("firebase-functions");

const functionsConfig = functions.config();

if (!functionsConfig) {
  throw new Error("failed: functionsConfig missing");
}
if (!functionsConfig.project) {
  throw new Error("failed: functionsConfig.project missing");
}
if (!functionsConfig.project.id) {
  throw new Error("failed: functionsConfig.project.id missing");
}

const firebaseConfig = {
  projectId: functionsConfig.project.id,
};

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

export const access = require("./access");

export const auth = require("./auth");
export const venue = require("./venue");
export const video = require("./video");
export const scheduled = require("./scheduled");
export const world = require("./world");
export const triggered = require("./triggered");
