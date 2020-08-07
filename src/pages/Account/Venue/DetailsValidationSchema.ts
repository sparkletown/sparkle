import * as Yup from "yup";
import "firebase/functions";
import { VenueInput, VenueInputEdit } from "api/admin";
import { TemplateType } from "settings";
import firebase from "firebase/app";
import { createUrlSafeName } from "api/admin";

type Question = VenueInput["profileQuestions"][number];

const createFileSchema = (name: string, required: boolean) =>
  Yup.mixed<FileList>().test(
    name,
    "Image required",
    (val: FileList) => !required || val.length > 0
  );

export const validationSchema = Yup.object()
  .shape<VenueInput>({
    name: Yup.string()
      .required("Display name required")
      .test(
        "dfsd",
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
        "dfsd",
        "Must have alphanumeric characters",
        (val: string) => createUrlSafeName(val).length > 0
      ),
    bannerImageFile: createFileSchema("bannerImageFile", true).required(
      "Required"
    ),
    logoImageFile: createFileSchema("logoImageFile", true).required("Required"),
    tagline: Yup.string().required("Required"),
    longDescription: Yup.string().required("Required"),
    mapIconImageFile: Yup.mixed<FileList>().when(
      "$template.type",
      (type: TemplateType, schema: Yup.MixedSchema<FileList>) =>
        type === "PERFORMANCE_VENUE" || type === "ZOOM_ROOM"
          ? schema
              .required("Required")
              .test(
                "mapIconImage",
                "Image required",
                (val: FileList) => val.length > 0
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
  bannerImageUrl: Yup.string().required(),
  logoImageUrl: Yup.string().required(),
  mapIconImageUrl: Yup.string(),
});

// this is used to transform the api data to conform to the yup schema
export const editVenueCastSchema = Yup.object()
  .shape<Partial<VenueInput>>({})
  .from("subtitle", "tagline")
  .from("config.landingPageConfig.subtitle", "tagline")
  .from("config.landingPageConfig.description", "longDescription")
  .from("profile_questions", "profileQuestions")
  .from("host.icon", "logoImageUrl")
  .from("config.landingPageConfig.coverImageUrl", "bannerImageUrl");
