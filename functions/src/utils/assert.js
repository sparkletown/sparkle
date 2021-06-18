const { HttpsError } = require("firebase-functions/lib/providers/https");

const { isValidUrl } = require("./url");
const { checkIfValidVenueId } = require("./venue");

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

exports.assertValidVenueId = assertValidVenueId;
exports.assertValidUrl = assertValidUrl;
