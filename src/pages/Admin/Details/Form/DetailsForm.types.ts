import { TVenueWizard } from "pages/Admin/Venue/VenueWizard/VenueWizard.types";
import { FormValues } from "../Details.types";

export interface DetailsFormProps {
  previous: TVenueWizard["previous"];
  dispatch: any;
  venueId: string;
  editData?: FormValues;
}
