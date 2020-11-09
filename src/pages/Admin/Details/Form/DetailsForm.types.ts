import { WizardState } from "pages/Admin/Venue/VenueWizard/redux";
import { TVenueWizard } from "pages/Admin/Venue/VenueWizard/VenueWizard.types";

export interface FormValues extends WizardState {
  bannerImageFile?: FileList;
  logoImageFile?: FileList;
}

export interface DetailsFormProps {
  previous: TVenueWizard["previous"];
  dispatch: any;
  venueId?: string;
  editData?: WizardState;
}
