import * as Yup from "yup";

import { testWorldBySlugExists } from "utils/validation";

import { createNameSchema } from "forms/factory/createNameSchema";

export const worldStartSchema = Yup.object().shape({
  name: createNameSchema({ name: "Name" }).when(
    "$creating",
    (creating: boolean, schema: Yup.StringSchema) =>
      creating
        ? schema.test(
            "name",
            "This world slug is already taken",
            testWorldBySlugExists
          )
        : schema
  ),
  description: Yup.string().notRequired(),
  subtitle: Yup.string().notRequired(),
  bannerImageFile: Yup.mixed<FileList>().notRequired(),
  bannerImageUrl: Yup.string(),
  logoImageFile: Yup.mixed<FileList>().notRequired(),
  logoImageUrl: Yup.string(),
});
