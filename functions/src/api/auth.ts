import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";

import { AuthConfigSchema } from "../types/auth";
import { checkIfValidVenueId } from "../utils/venue";

export const getAuthConfigsCollectionRef = () =>
  admin.firestore().collection("authConfigs");

export const getAuthConfigRef = (venueId: string) =>
  getAuthConfigsCollectionRef().doc(venueId);

export const fetchAuthConfig = async (venueId: string) => {
  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError("invalid-argument", "venueId is invalid");
  }

  const authConfigDoc = await getAuthConfigRef(venueId).get();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return AuthConfigSchema.validate(authConfigDoc.data()).catch((error: any) => {
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
