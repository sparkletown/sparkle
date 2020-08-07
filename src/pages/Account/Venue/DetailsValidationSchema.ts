import * as Yup from "yup";
import "firebase/functions";
import { VenueInput } from "api/admin";
import { TemplateType } from "settings";
import firebase from "firebase/app";
import { createUrlSafeName } from "api/admin";

type Question = VenueInput["profileQuestions"][number];

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
    bannerImageFile: Yup.mixed<FileList>()
      .required("Required")
      .test("bannerImage", "Image required", (val: FileList) => val.length > 0),
    logoImageFile: Yup.mixed<FileList>()
      .required("Required")
      .test("logoImage", "Image required", (val: FileList) => val.length > 0),
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
