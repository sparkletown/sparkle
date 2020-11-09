import * as Yup from "yup";
import { venueSchema } from "./ValidationSchema";

// bad typing.
// If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't
export type FormValues = Partial<Yup.InferType<typeof venueSchema>>;

export interface DetailsProps {
  previous?: () => void;
  venueId?: string;
  editData?: FormValues;
  dispatch: any;
}
