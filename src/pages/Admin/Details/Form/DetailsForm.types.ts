import { WizardState } from "pages/Admin/Venue/VenueWizard/redux";
import { TVenueWizard } from "pages/Admin/Venue/VenueWizard/VenueWizard.types";
import { useForm, FieldErrors } from "react-hook-form";
import { FormValues } from "../Details.types";

export interface DetailsFormProps {
  state: WizardState;
  previous: TVenueWizard["previous"];

  dispatch: any;
  venueId: string;

}
