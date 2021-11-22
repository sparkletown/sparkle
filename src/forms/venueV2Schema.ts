import firebase from "firebase/app";
import * as Yup from "yup";

import { createSlug } from "api/admin";

import { mustBeMinimum } from "forms/common";
import { commonTitleSchema } from "forms/commonTitleSchema";

export interface VenueV2SchemaShape {
  name: string;
  subtitle?: string;
  description?: string;

  bannerImageUrl?: string;
  logoImageUrl: string;
}

export const venueV2Schema = Yup.object()
  .shape<VenueV2SchemaShape>({
    name: commonTitleSchema.when(
      "$editing",
      (editing: boolean, schema: Yup.StringSchema) =>
        !editing
          ? schema
              .test(
                "name",
                "Must have alphanumeric characters",
                (val: string) => createSlug(val).length > 0
              )
              .test(
                "name",
                "This venue name is already taken",
                async (val: string) =>
                  !val ||
                  !(
                    await firebase
                      .firestore()
                      .collection("venues")
                      .doc(createSlug(val))
                      .get()
                  ).exists
              )
          : schema //will be set from the data from the api. Does not need to be unique
    ),
    subtitle: Yup.string().matches(/.{3,}/, {
      excludeEmptyString: true,
      message: mustBeMinimum("Subtitle", 3),
    }),
    description: Yup.string().matches(/.{3,}/, {
      excludeEmptyString: true,
      message: mustBeMinimum("Description", 3),
    }),

    bannerImageUrl: Yup.string(),
    logoImageUrl: Yup.string().required("Logo is required!"),
  })
  .required();
