import * as Yup from "yup";

import {
  COMMON_NAME_MAX_CHAR_COUNT,
  COMMON_NAME_MIN_CHAR_COUNT,
} from "settings/validationSettings";

import {
  messageMustBeMaximum,
  messageMustBeMinimum,
  testGeneratesValidSlug,
} from "forms/common";

export interface CreateNameSchemaOptions {
  name: string;
  withMin?: boolean;
}

export const createNameSchema = ({
  name,
  withMin,
}: CreateNameSchemaOptions) => {
  let schema = Yup.string()
    .required(`${name} is required`)
    .max(COMMON_NAME_MAX_CHAR_COUNT, ({ max }) =>
      messageMustBeMaximum(name, max)
    )
    .test(name, "Must have alphanumeric characters", testGeneratesValidSlug);

  if (withMin) {
    schema = schema.min(COMMON_NAME_MIN_CHAR_COUNT, ({ min }) =>
      messageMustBeMinimum(name, min)
    );
  }

  return schema;
};
