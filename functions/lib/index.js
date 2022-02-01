"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggered = exports.world = exports.scheduled = exports.video = exports.venue = exports.auth = exports.analytics = exports.access = void 0;
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
admin.initializeApp(Object.assign(Object.assign({}, firebaseConfig), { credential: admin.credential.cert(Object.assign(Object.assign({}, functionsConfig.service_account), { private_key: functionsConfig.service_account.private_key.replace(/\\n/g, "\n") })) }));
exports.access = require("./access");
exports.analytics = require("./analytics");
exports.auth = require("./auth");
exports.venue = require("./venue");
exports.video = require("./video");
exports.scheduled = require("./scheduled");
exports.world = require("./world");
exports.triggered = require("./triggered");
//# sourceMappingURL=index.js.map