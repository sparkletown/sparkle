import { FieldError, UseFormRegister } from "react-hook-form";

export type FormFieldProps = {
  register: UseFormRegister<any>;
  error: FieldError | undefined;
};
