import { createUrlSafeName, VenueInput, VenueInputEdit } from "api/admin";
import firebase from "firebase/app";
import "firebase/functions";
import * as Yup from "yup";
import { VenueTemplate } from "types/VenueTemplate";
import {
  ZOOM_URL_TEMPLATES,
  VIDEO_IFRAME_TEMPLATES,
  EMBED_IFRAME_TEMPLATES,
} from "settings";

type Question = VenueInput["profileQuestions"][number];

const createFileSchema = (name: string, required: boolean) =>
  Yup.mixed<FileList>().test(
    name,
    "Image required",
    (val: FileList) => !required || val.length > 0
  );

const urlIfNoFileValidation = (fieldName: string) =>
  Yup.string().when(
    fieldName,
    (file: FileList | undefined, schema: Yup.MixedSchema<FileList>) =>
      file && file.length > 0
        ? schema.notRequired()
        : schema.required("Required")
  );

export const validationSchema = Yup.object()
  .shape<VenueInput>({
    name: Yup.string()
      .required("Display name required")
      .test(
        "name",
        "This venue name is already taken",
        async (val: string) =>
          !(
            await firebase
              .firestore()
              .collection("venues")
              .doc(createUrlSafeName(val))
              .get()
          ).exists
      )
      .test(
        "name",
        "Must have alphanumeric characters",
        (val: string) => createUrlSafeName(val).length > 0
      ),
    bannerImageFile: createFileSchema("bannerImageFile", true).required(
      "Required"
    ),
    logoImageFile: createFileSchema("logoImageFile", true).required("Required"),
    description: Yup.string().required("Required"),
    subtitle: Yup.string().required("Required"),
    mapIconImageFile: createFileSchema("mapIconImageFile", true).required(
      "Required"
    ),
    zoomUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        ZOOM_URL_TEMPLATES.includes(template)
          ? schema
              .required("Required")
              .test("zoomUrl", "URL required", (val: string) => val.length > 0)
          : schema.notRequired()
    ),
    videoIframeUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        VIDEO_IFRAME_TEMPLATES.includes(template)
          ? schema
              .required("Required")
              .test(
                "videoIframeUrl",
                "Video URL required",
                (val: string) => val.length > 0
              )
          : schema.notRequired()
    ),
    embedIframeUrl: Yup.string().when(
      "$template.template",
      (template: VenueTemplate, schema: Yup.MixedSchema<FileList>) =>
        EMBED_IFRAME_TEMPLATES.includes(template)
          ? schema
              .required("Required")
              .test(
                "embedIframeUrl",
                "Embedded object URL required",
                (val: string) => val.length > 0
              )
          : schema.notRequired()
    ),

    // @debt provide some validation error messages for invalid questions
    // advanced options
    profileQuestions: Yup.array<Question>()
      .ensure()
      .defined()
      .transform((val: Array<Question>) =>
        val.filter((s) => !!s.name && !!s.text)
      ), // ensure questions are not empty strings
  })
  .required();

type EditVenueInputs = Pick<
  VenueInputEdit,
  | "name"
  | "bannerImageFile"
  | "logoImageFile"
  | "mapIconImageFile"
  | "bannerImageUrl"
  | "logoImageUrl"
  | "mapIconImageUrl"
>;

export const editVenueValidationSchema = validationSchema.shape<
  EditVenueInputs
>({
  name: Yup.string().required(),
  bannerImageFile: createFileSchema("bannerImageFile", false).notRequired(), // override files to make them non required
  logoImageFile: createFileSchema("logoImageFile", false).notRequired(),
  mapIconImageFile: createFileSchema("mapIconImageFile", false).notRequired(),
  bannerImageUrl: urlIfNoFileValidation("bannerImageFile"),
  logoImageUrl: urlIfNoFileValidation("logoImageFile"),
  mapIconImageUrl: urlIfNoFileValidation("mapIconImageFile"),
});

// this is used to transform the api data to conform to the yup schema
export const editVenueCastSchema = Yup.object()
  .shape<Partial<VenueInput>>({})
  // possible locations for the subtitle
  .from("subtitle", "subtitle")
  .from("config.landingPageConfig.subtitle", "subtitle")

  .from("config.landingPageConfig.description", "description")
  .from("profile_questions", "profileQuestions")
  .from("host.icon", "logoImageUrl")

  // possible locations for the banner image
  .from("config.landingPageConfig.coverImageUrl", "bannerImageUrl")
  .from("config.landingPageConfig.bannerImageUrl", "bannerImageUrl")

  // possible locations for the map icon
  .from("config.mapIconImageUrl", "mapIconImageUrl")
  .from("mapIconImageUrl", "mapIconImageUrl");
