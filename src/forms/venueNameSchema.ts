import firebase from "firebase/app";
import * as Yup from "yup";

import { VENUE_NAME_MAX_CHAR_COUNT, VENUE_NAME_MIN_CHAR_COUNT } from "settings";

import { createSlug } from "api/admin";

export const venueNameSchema = Yup.string()
  .required("Venue name is required")
  .min(
    VENUE_NAME_MIN_CHAR_COUNT,
    ({ min }) => `Name must be at least ${min} characters`
  )
  .max(
    VENUE_NAME_MAX_CHAR_COUNT,
    ({ max }) => `Name must be less than ${max} characters`
  )
  .test(
    "name",
    "Must have alphanumeric characters",
    (val: string) => createSlug(val).length > 0
  )
  .test(
    "name",
    "This name is already taken",
    async (val: string) =>
      !val ||
      !(
        await firebase
          .firestore()
          .collection("venues")
          .doc(createSlug(val))
          .get()
      ).exists
  );
