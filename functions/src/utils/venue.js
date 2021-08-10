const admin = require("firebase-admin");
const { HttpsError } = require("firebase-functions/lib/providers/https");
const { VenueIdSchema } = require("../types/venue");

const VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;

const getVenueId = (name) => {
  return name.replace(/\W/g, "").toLowerCase();
};

const checkIfValidVenueId = (venueId) => VenueIdSchema.isValidSync(venueId);

const checkUserIsOwner = async (venueId, uid) => {
  await admin
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        throw new HttpsError("not-found", `Venue ${venueId} does not exist`);
      }
      const venue = doc.data();
      if (venue.owners && venue.owners.includes(uid)) return;

      if (venue.parentId) {
        const doc = await admin
          .firestore()
          .collection("venues")
          .doc(venue.parentId)
          .get();

        if (!doc.exists) {
          throw new HttpsError(
            "not-found",
            `Venue ${venueId} references missing parent ${venue.parentId}`
          );
        }
        const parentVenue = doc.data();
        if (!(parentVenue.owners && parentVenue.owners.includes(uid))) {
          throw new HttpsError(
            "permission-denied",
            `User is not an owner of ${venueId} nor parent ${venue.parentId}`
          );
        }
      }

      throw new HttpsError(
        "permission-denied",
        `User is not an owner of ${venueId}`
      );
    })
    .catch((err) => {
      throw new HttpsError(
        "internal",
        `Error occurred obtaining venue ${venueId}: ${err.toString()}`
      );
    });
};

exports.VENUE_ID_REGEX = VENUE_ID_REGEX;
exports.getVenueId = getVenueId;
exports.checkIfValidVenueId = checkIfValidVenueId;
exports.checkUserIsOwner = checkUserIsOwner;
