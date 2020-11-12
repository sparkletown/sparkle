import * as Yup from "yup";

import { createUrlSafeName, VenueInput, PlacementInput } from "api/admin";
import firebase from "firebase/app";
import "firebase/functions";
import { VenueTemplate } from "types/VenueTemplate";
import {
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  BACKGROUND_IMG_TEMPLATES,
  PLAYA_VENUE_SIZE,
  MAX_IMAGE_FILE_SIZE_BYTES,
  GIF_RESIZER_URL,
  PLAYA_WIDTH,
  PLAYA_HEIGHT,
} from "settings";

const initialMapIconPlacement: VenueInput["placement"] = {
  x: (PLAYA_WIDTH - PLAYA_VENUE_SIZE) / 2,
  y: (PLAYA_HEIGHT - PLAYA_VENUE_SIZE) / 2,
};

type Question = VenueInput["profileQuestions"][number];

export interface SchemaShape {
  name: string;
  subtitle: string;
  description: string;

  bannerImageFile: FileList;
  bannerImageUrl: string;

  logoImageFile: FileList;
  logoImageUrl: string;

  showGrid: boolean;
  columns?: number;
}

const createFileSchema = (
  name: string,
  required: boolean,
  fieldName: string = "Image"
) =>
  Yup.mixed<FileList>()
    .test(
      name,
      `${fieldName} is required!`,
      (val: FileList) => !required || val.length > 0
    )
    .test(
      name,
      `File size limit is 2mb. You can shrink images at ${GIF_RESIZER_URL}`,
      async (val?: FileList) => {
        if (!val || val.length === 0) return true;
        const file = val[0];
        return file.size <= MAX_IMAGE_FILE_SIZE_BYTES;
      }
    );

const urlIfNoFileValidation = (fieldName: string) =>
  Yup.string().when(
    fieldName,
    (file: FileList | undefined, schema: Yup.MixedSchema<FileList>) =>
      file && file.length > 0
        ? schema.notRequired()
        : schema.required("Required")
  );

const mustBeMinimum = (fieldName: string, min: number) =>
  `${fieldName} must be at least ${min} characters`;

export const venueSchema = Yup.object()
  .shape<SchemaShape>({
    name: Yup.string()
      .required("Name is required!")
      .min(3, ({ min }) => `Name must be at least ${min} characters`)
      .when(
        "$editing",
        (editing: boolean, schema: Yup.StringSchema) =>
          !editing
            ? schema
                .test(
                  "name",
                  "Must have alphanumeric characters",
                  (val: string) => createUrlSafeName(val).length > 0
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
                        .doc(createUrlSafeName(val))
                        .get()
                    ).exists
                )
            : schema //will be set from the data from the api. Does not need to be unique
      ),
    subtitle: Yup.string()
      .required("Subtitle is required!")
      .min(3, ({ min }) => mustBeMinimum("Subtitle", min)),
    description: Yup.string()
      .required("Description is required!")
      .min(3, ({ min }) => mustBeMinimum("Description", min)),

    bannerImageFile: Yup.mixed<FileList>().when("$editing", {
      is: false,
      then: createFileSchema("bannerImageUrl", true, "Banner"),
    }),
    bannerImageUrl: Yup.string().required("Banner is required!"),

    logoImageFile: Yup.mixed<FileList>().when("$editing", {
      is: false,
      then: createFileSchema("logoImageUrl", true, "Logo"),
    }),
    logoImageUrl: Yup.string().required("Logo is required!"),

    showGrid: Yup.boolean().required(),
    columns: Yup.number().when("showGrid", {
      is: true,
      then: Yup.number()
        .required("Number of columns is required!")
        .min(1)
        .positive(),
      otherwise: Yup.number(),
    }),
  })
  .required();

export const venueEditSchema = Yup.object()
  .shape<Partial<SchemaShape>>({})
  .from("subtitle", "subtitle")
  .from("config.landingPageConfig.description", "description");

export const validationSchema = Yup.object()
  .shape<VenueInput>({
    template: Yup.string(),
    name: Yup.string()
      .required("Name is required!")
      .min(3, ({ min }) => mustBeMinimum("Name", min))
      .when(
        "$editing",
        (schema: Yup.StringSchema) => schema //will be set from the data from the api. Does not need to be unique
      ),
    bannerImageFile: createFileSchema("bannerImageFile", false),
    logoImageFile: createFileSchema("logoImageFile", false).notRequired(),

    bannerImageUrl: urlIfNoFileValidation("bannerImageFile"),
    logoImageUrl: urlIfNoFileValidation("logoImageFile"),
    showGrid: Yup.bool().notRequired(),
    columns: Yup.number().notRequired().min(1).max(100),

    mapIconImageFile: createFileSchema("mapIconImageFile", false).notRequired(),
    mapIconImageUrl: urlIfNoFileValidation("mapIconImageFile"),

    mapBackgroundImageFile: Yup.mixed<FileList>().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        BACKGROUND_IMG_TEMPLATES.includes(template)
          ? createFileSchema("mapBackgroundImageFile", false).notRequired()
          : schema.notRequired()
    ),

    mapBackgroundImageUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.StringSchema) =>
        BACKGROUND_IMG_TEMPLATES.includes(template)
          ? urlIfNoFileValidation("mapBackgroundImageFile")
          : schema.notRequired()
    ),

    description: Yup.string().required("Description is required!"),
    subtitle: Yup.string().required("Subtitle is required!"),
    zoomUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        ZOOM_URL_TEMPLATES.includes(template)
          ? schema
              .required("Required")
              .test("zoomUrl", "URL required", (val: string) => val.length > 0)
          : schema.notRequired()
    ),
    iframeUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        IFRAME_TEMPLATES.includes(template)
          ? schema
              .required("Required")
              .test(
                "iframeUrl",
                "Video URL required",
                (val: string) => val.length > 0
              )
          : schema.notRequired()
    ),

    width: Yup.number().notRequired().min(0).max(PLAYA_WIDTH),
    height: Yup.number().notRequired().min(0).max(PLAYA_HEIGHT),

    placement: Yup.object()
      .shape({
        x: Yup.number().required("Required").min(0).max(PLAYA_WIDTH),
        y: Yup.number().required("Required").min(0).max(PLAYA_HEIGHT),
      })
      .default(initialMapIconPlacement),

    // @debt provide some validation error messages for invalid questions
    // advanced options
    profileQuestions: Yup.array<Question>()
      .ensure()
      .defined()
      .transform((val: Array<Question>) =>
        val.filter((s) => !!s.name && !!s.text)
      ), // ensure questions are not empty strings

    placementRequests: Yup.string().notRequired(),
    adultContent: Yup.bool().required(),
    bannerMessage: Yup.string().notRequired(),
    parentId: Yup.string().notRequired(),
  })
  .required();

// this is used to transform the api data to conform to the yup schema
export const editVenueCastSchema = Yup.object()
  .shape<Partial<VenueInput>>({})
  // possible locations for the subtitle
  .from("subtitle", "subtitle")
  .from("config.landingPageConfig.subtitle", "subtitle")

  .from("config.landingPageConfig.description", "description")
  .from("profile_questions", "profileQuestions")
  .from("host.icon", "logoImageUrl")
  .from("adultContent", "adultContent")
  .from("showGrid", "showGrid")
  .from("columns", "columns")

  // possible locations for the banner image
  .from("config.landingPageConfig.coverImageUrl", "bannerImageUrl")
  .from("config.landingPageConfig.bannerImageUrl", "bannerImageUrl")

  // possible locations for the map icon
  .from("config.mapIconImageUrl", "mapIconImageUrl")
  .from("mapIconImageUrl", "mapIconImageUrl");

export const editPlacementCastSchema = Yup.object()
  .shape<Partial<PlacementInput>>({})

  // possible locations for the map icon
  .from("config.mapIconImageUrl", "mapIconImageUrl")
  .from("mapIconImageUrl", "mapIconImageUrl")
  .from("placement.addressText", "addressText")
  .from("placement.notes", "notes")
  .required();

export const editPlacementSchema = Yup.object().shape<PlacementInput>({
  mapIconImageFile: createFileSchema("mapIconImageFile", false).notRequired(),
  mapIconImageUrl: urlIfNoFileValidation("mapIconImageFile"),
  addressText: Yup.string(),
  notes: Yup.string(),
  width: Yup.number().required("Required"),
  height: Yup.number().required("Required"),
  placement: Yup.object()
    .shape({
      x: Yup.number().required("Required").min(0).max(PLAYA_WIDTH),
      y: Yup.number().required("Required").min(0).max(PLAYA_HEIGHT),
    })
    .default(initialMapIconPlacement),
});
