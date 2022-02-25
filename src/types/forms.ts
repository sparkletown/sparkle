import { FieldError, UseFormRegister } from "react-hook-form";

import { AnyForm } from "./utility";

export type FormFieldProps = {
  register: UseFormRegister<AnyForm>;
  error: FieldError | undefined;
};
