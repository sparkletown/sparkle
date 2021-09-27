import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";

import { AuthConfig, AuthConfigSchema } from "../types/auth";

import { checkIfValidVenueId } from "../utils/venue";

export const getAuthConfigsCollectionRef = () =>
  admin.firestore().collection("authConfigs");

export const getAuthConfigRef = (venueId: string) =>
  getAuthConfigsCollectionRef().doc(venueId);

// TODO: do we need to implement finding the sovereign venue to implement this properly..? Probably should..
export const fetchAuthConfig = async (venueId: string) => {
  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError("invalid-argument", "venueId is invalid");
  }

  const authConfigDoc = await getAuthConfigRef(venueId).get();

  let result: AuthConfig | undefined;
  let error: any;

  try {
    result = await AuthConfigSchema.validate(authConfigDoc.data());
  } catch (err) {
    error = err;
  }
  if (!result) {
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
  }

  return result;
};
