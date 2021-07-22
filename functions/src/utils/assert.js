const functions = require("firebase-functions");
const { HttpsError } = require("firebase-functions/lib/providers/https");

const { isValidUrl } = require("./url");
const { checkIfValidVenueId } = require("./venue");

const PROJECT_ID = functions.config().project.id;

const assertValidAuth = (context) => {
  if (!context.auth || !context.auth.token) {
    throw new HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== PROJECT_ID) {
    throw new HttpsError("permission-denied", "Token invalid");
  }
};

const assertValidVenueId = (venueId, paramName = "venueId") => {
  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError(
      "invalid-argument",
      `${paramName} is not a valid venue id`
    );
  }
};

const assertValidUrl = (url, paramName = "url") => {
  if (!isValidUrl(url)) {
    throw new HttpsError("invalid-argument", `${paramName} is not a valid URL`);
  }
};

exports.assertValidAuth = assertValidAuth;
exports.assertValidVenueId = assertValidVenueId;
exports.assertValidUrl = assertValidUrl;

/**
 * @deprecated use assertValidAuth export/naming instead
 */
exports.checkAuth = assertValidAuth;
