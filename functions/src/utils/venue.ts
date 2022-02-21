import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v1/https";

import { VenueIdSchema } from "../types/venue";

export const VENUE_ID_REGEX = /[a-z0-9_]{1,250}/;
const INVALID_SLUG_CHARS_REGEX = /[^a-zA-Z0-9]/g;

export const generateSlug = (name: string) =>
  name.replace(INVALID_SLUG_CHARS_REGEX, "").toLowerCase();

export const checkIfValidVenueId = (venueId: string) =>
  VenueIdSchema.isValidSync(venueId);

export const getSpaceById = async (spaceId: string) => {
  const doc = await admin.firestore().collection("venues").doc(spaceId).get();

  if (!doc || !doc.exists) {
    throw new HttpsError("not-found", `Space ${spaceId} not found`);
  }
  const space = doc.data();
  if (!space) {
    throw new HttpsError("internal", `Space not found`);
  }

  return space;
};
