const admin = require("firebase-admin");
const functions = require("firebase-functions");

const { HttpsError } = require("firebase-functions/lib/providers/https");

const { AuthConfigSchema } = require("../types/auth");

const { checkIfValidVenueId } = require("../utils/venue");

const getAuthConfigsCollectionRef = () =>
  admin.firestore().collection("authConfigs");

const getAuthConfigRef = (venueId) =>
  getAuthConfigsCollectionRef().doc(venueId);

const fetchAuthConfig = async (venueId) => {
  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError("invalid-argument", "venueId is invalid");
  }

  const authConfigDoc = await getAuthConfigRef(venueId).get();

  return AuthConfigSchema.validate(authConfigDoc.data()).catch((error) => {
    // Log the specific error details for further investigation
    functions.logger.error(
      "AuthConfigSchema validation failed",
      venueId,
      error
    );

    // Throw a generic error to be returned to the frontend
    throw new HttpsError(
      "internal",
      "venueId is invalid, venue is not configured to use this auth method, or auth configuration is broken"
    );
  });
};

exports.getAuthConfigsCollectionRef = getAuthConfigsCollectionRef;
exports.getAuthConfigRef = getAuthConfigRef;
exports.fetchAuthConfig = fetchAuthConfig;
