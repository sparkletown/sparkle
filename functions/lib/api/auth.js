"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAuthConfig = exports.getAuthConfigRef = exports.getAuthConfigsCollectionRef = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const https_1 = require("firebase-functions/v1/https");
const auth_1 = require("../types/auth");
const venue_1 = require("../utils/venue");
const getAuthConfigsCollectionRef = () => admin.firestore().collection("authConfigs");
exports.getAuthConfigsCollectionRef = getAuthConfigsCollectionRef;
const getAuthConfigRef = (venueId) => (0, exports.getAuthConfigsCollectionRef)().doc(venueId);
exports.getAuthConfigRef = getAuthConfigRef;
// TODO: do we need to implement finding the sovereign venue to implement this properly..? Probably should..
const fetchAuthConfig = async (venueId) => {
    if (!(0, venue_1.checkIfValidVenueId)(venueId)) {
        throw new https_1.HttpsError("invalid-argument", "venueId is invalid");
    }
    const authConfigDoc = await (0, exports.getAuthConfigRef)(venueId).get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return auth_1.AuthConfigSchema.validate(authConfigDoc.data()).catch((error) => {
        // Log the specific error details for further investigation
        functions.logger.error("AuthConfigSchema validation failed", venueId, error);
        // Throw a generic error to be returned to the frontend
        throw new https_1.HttpsError("internal", "venueId is invalid, venue is not configured to use this auth method, or auth configuration is broken");
    });
};
exports.fetchAuthConfig = fetchAuthConfig;
//# sourceMappingURL=auth.js.map