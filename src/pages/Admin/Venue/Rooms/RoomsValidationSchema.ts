import { RoomInput } from "api/admin";
import "firebase/functions";
import * as Yup from "yup";
import { PLAYA_ICON_SIDE_PERCENTAGE } from "settings";
import { isValidUrl } from "utils/url";

const INITIAL_PERCENTAGE_POS = 50 - PLAYA_ICON_SIDE_PERCENTAGE / 2;

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
  .shape<RoomInput>({
    title: Yup.string().required("Required"),
    subtitle: Yup.string().required("Required"),
    about: Yup.string().required("Required"),
    url: Yup.string()
      .test("url validation", "Enter correct url", isValidUrl)
      .required("Required"),
    x_percent: Yup.number()
      .default(INITIAL_PERCENTAGE_POS)
      .required("Required")
      .min(0)
      .max(100),
    y_percent: Yup.number()
      .default(INITIAL_PERCENTAGE_POS)
      .required("Required")
      .min(0)
      .max(100),
    width_percent: Yup.number()
      .default(PLAYA_ICON_SIDE_PERCENTAGE)
      .required("Required")
      .min(0)
      .max(100),
    height_percent: Yup.number()
      .default(PLAYA_ICON_SIDE_PERCENTAGE)
      .required("Required")
      .min(0)
      .max(100),
    image_url: urlIfNoFileValidation("image_file"),
    image_file: createFileSchema("image_file", false),
    isEnabled: Yup.boolean().required("Required"),
  })
  .required();
