import { createUrlSafeName, VenueInput } from "api/admin";
import firebase from "firebase/app";
import "firebase/functions";
import * as Yup from "yup";
import { VenueTemplate } from "types/VenueTemplate";
import {
  ZOOM_URL_TEMPLATES,
  IFRAME_TEMPLATES,
  BACKGROUND_IMG_TEMPLATES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  GIF_RESIZER_URL,
} from "settings";

type Question = VenueInput["profileQuestions"][number];

const createFileSchema = (name: string, required: boolean) =>
  Yup.mixed<FileList>()
    .test(
      name,
      "Image required",
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

export const validationSchema = Yup.object()
  .shape<VenueInput>({
    template: Yup.string().required(),
    name: Yup.string()
      .required("Required")
      .min(1, "Required")
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
    bannerImageFile: createFileSchema("bannerImageFile", false).notRequired(), // override files to make them non required
    logoImageFile: createFileSchema("logoImageFile", false).notRequired(),

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

    bannerImageUrl: urlIfNoFileValidation("bannerImageFile"),
    logoImageUrl: urlIfNoFileValidation("logoImageFile"),
    description: Yup.string().required("Required"),
    subtitle: Yup.string().required("Required"),
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

    // @debt provide some validation error messages for invalid questions
    // advanced options
    profileQuestions: Yup.array<Question>()
      .ensure()
      .defined()
      .transform((val: Array<Question>) =>
        val.filter((s) => !!s.name && !!s.text)
      ), // ensure questions are not empty strings

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
