import * as Yup from "yup";
import { validationSchema } from "../Venue/DetailsValidationSchema";

// bad typing.
// If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't
export type FormValues = Partial<Yup.InferType<typeof validationSchema>>;
