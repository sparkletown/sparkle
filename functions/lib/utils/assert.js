"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidUrl = exports.assertValidVenueId = exports.assertValidAuth = void 0;
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v1/https");
const url_1 = require("./url");
const venue_1 = require("./venue");
const PROJECT_ID = functions.config().project.id;
const assertValidAuth = (context) => {
    if (!context.auth || !context.auth.token) {
        throw new https_1.HttpsError("unauthenticated", "Please log in");
    }
    if (context.auth.token.aud !== PROJECT_ID) {
        throw new https_1.HttpsError("permission-denied", "Token invalid");
    }
};
exports.assertValidAuth = assertValidAuth;
const assertValidVenueId = (venueId, paramName = "venueId") => {
    if (!(0, venue_1.checkIfValidVenueId)(venueId)) {
        throw new https_1.HttpsError("invalid-argument", `${paramName} is not a valid venue id`);
    }
};
exports.assertValidVenueId = assertValidVenueId;
const assertValidUrl = (url, paramName = "url") => {
    if (!(0, url_1.isValidUrl)(url)) {
        throw new https_1.HttpsError("invalid-argument", `${paramName} is not a valid URL`);
    }
};
exports.assertValidUrl = assertValidUrl;
//# sourceMappingURL=assert.js.map