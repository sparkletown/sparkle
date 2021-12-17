import * as Yup from "yup";

import { Question } from "types/Question";

export const questionSchema = Yup.array<Question>()
  .ensure()
  .defined()
  .transform((value) =>
    value.filter(({ name, text }: Question) => !!name && !!text)
  );
