import * as Yup from "yup";
import "firebase/functions";
import { VenueInput } from "api/admin";
import { TemplateType } from "settings";

export const validationSchema = Yup.object()
  .shape<VenueInput>({
    name: Yup.string()
      .required("Display name required")
      .test(
        "dfsd",
        "Must have alphanumeric characters",
        (val: string) => val.replace(/\W/g, "").length > 0
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
  })
  .required();
