import * as functions from "firebase-functions";
import { CallableContext, HttpsError } from "firebase-functions/v1/https";

import { isValidUrl } from "./url";
import { checkIfValidVenueId } from "./venue";

const PROJECT_ID = functions.config().project.id;

export const assertValidAuth = (context: CallableContext) => {
  if (!context.auth || !context.auth.token) {
    throw new HttpsError("unauthenticated", "Please log in");
  }

  if (context.auth.token.aud !== PROJECT_ID) {
    throw new HttpsError("permission-denied", "Token invalid");
  }
};

export const assertValidVenueId = (venueId: string, paramName = "venueId") => {
  if (!checkIfValidVenueId(venueId)) {
    throw new HttpsError(
      "invalid-argument",
      `${paramName} is not a valid venue id`
    );
  }
};

export const assertValidUrl = (url: string, paramName = "url") => {
  if (!isValidUrl(url)) {
    throw new HttpsError("invalid-argument", `${paramName} is not a valid URL`);
  }
};
