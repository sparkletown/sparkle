import firebase from "firebase/app";
import * as Yup from "yup";

import { VENUE_NAME_MAX_CHAR_COUNT } from "settings";

import { createSlug } from "api/admin";

export const worldStartSchema = Yup.object().shape({
  name: Yup.string()
    .max(VENUE_NAME_MAX_CHAR_COUNT)
    .required()
    .test(
      "name",
      "Must have alphanumeric characters",
      (val: string) => createSlug(val).length > 0
    )
    .when("$creating", (creating: boolean, schema: Yup.StringSchema) =>
      creating
        ? schema.test(
            "name",
            "This world slug is already taken",
            // @debt Replace with a function from api/worlds
            async (val: string) =>
              !val ||
              !(
                await firebase
                  .firestore()
                  .collection("worlds")
                  .where("slug", "==", createSlug(val))
                  .get()
              ).docs.length
          )
        : schema
    ),
  description: Yup.string().notRequired(),
  subtitle: Yup.string().notRequired(),
  bannerImageFile: Yup.mixed<FileList>().notRequired(),
  bannerImageUrl: Yup.string(),
  logoImageFile: Yup.mixed<FileList>().notRequired(),
  logoImageUrl: Yup.string(),
});
