import * as Yup from "yup";

import {
  COMMON_STRING_MIN_CHAR_COUNT,
  COMMON_STRING_MIN_CHAR_COUNT_RE,
} from "settings";

import {
  messageMustBeMinimum,
  testGeneratesValidSlug,
  testVenueByNameExists,
} from "utils/validation";

import { createNameSchema } from "forms/factory/createNameSchema";

export interface VenueV2SchemaShape {
  name: string;
  subtitle?: string;
  description?: string;

  bannerImageUrl?: string;
  logoImageUrl: string;
}

export const detailsSchema = Yup.object()
  .shape<VenueV2SchemaShape>({
    name: createNameSchema({ name: "Name", withMin: true }).when(
      "$editing",
      (editing: boolean, schema: Yup.StringSchema) =>
        !editing
          ? schema
              .test(
                "name",
                "Must have alphanumeric characters",
                testGeneratesValidSlug
              )
              .test(
                "name",
                "This venue name is already taken",
                testVenueByNameExists
              )
          : schema //will be set from the data from the api. Does not need to be unique
    ),
    subtitle: Yup.string().matches(COMMON_STRING_MIN_CHAR_COUNT_RE, {
      excludeEmptyString: true,
      message: messageMustBeMinimum("Subtitle", COMMON_STRING_MIN_CHAR_COUNT),
    }),
    description: Yup.string().matches(COMMON_STRING_MIN_CHAR_COUNT_RE, {
      excludeEmptyString: true,
      message: messageMustBeMinimum(
        "Description",
        COMMON_STRING_MIN_CHAR_COUNT
      ),
    }),

    bannerImageUrl: Yup.string(),
    logoImageUrl: Yup.string().required("Logo is required!"),
  })
  .required();
