import * as Yup from "yup";

import { entranceSchema } from "forms/entranceSchema";
import { questionSchema } from "forms/questionSchema";

export const worldEntranceSchema = Yup.object().shape({
  adultContent: Yup.bool().notRequired(),
  requiresDateOfBirth: Yup.bool().notRequired(),
  code: questionSchema.notRequired(),
  entrance: entranceSchema.notRequired(),
});
