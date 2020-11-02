import { WizardState } from "pages/Admin/Venue/VenueWizard/redux";
import { TVenueWizard } from "pages/Admin/Venue/VenueWizard/VenueWizard.types";
import { useForm, FieldErrors } from "react-hook-form";
import { FormValues } from "../Details.types";

export interface DetailsFormProps {
  state: WizardState;
  previous: TVenueWizard["previous"];
  values: FormValues;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm>["register"];
  watch: ReturnType<typeof useForm>["watch"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: ReturnType<ReturnType<typeof useForm>["handleSubmit"]>;
  errors: FieldErrors<FormValues>;
  editing?: boolean;
  setValue: ReturnType<typeof useForm>["setValue"];
  formError: boolean;
  dispatch: any;
}
