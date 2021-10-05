import * as Yup from "yup";

export const WorldFormValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().notRequired(),
  subtitle: Yup.string().notRequired(),
  // bannerImageFile: Yup.mixed<FileList>().notRequired(),
  // bannerImageUrl: Yup.string(),
  // logoImageFile: Yup.mixed<FileList>().notRequired(),
  // logoImageUrl: Yup.string(),
  // mapBackgroundImageFile: Yup.mixed<FileList>().notRequired(),
  // mapBackgroundImageUrl: Yup.string(),
});
