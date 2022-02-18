import { FieldError, UseFormRegister } from "react-hook-form";

export type FormFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error: FieldError | undefined;
};
