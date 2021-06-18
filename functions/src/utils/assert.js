const { HttpsError } = require("firebase-functions/lib/providers/https");

const { checkIfValidVenueId } = require("./venue");

const assertValidVenueId = (venueId, paramName = "venueId") => {
  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError(
      "invalid-argument",
      `${paramName} is not a valid venue id`
    );
  }
};

exports.assertValidVenueId = assertValidVenueId;
