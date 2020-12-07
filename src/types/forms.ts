import { FieldError, useForm } from "react-hook-form";

export type FormFieldProps = {
  register: ReturnType<typeof useForm>["register"];
  error: FieldError | undefined;
};
