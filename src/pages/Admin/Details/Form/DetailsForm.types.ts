import { WizardState } from "pages/Admin/Venue/VenueWizard/redux";
import { TVenueWizard } from "pages/Admin/Venue/VenueWizard/VenueWizard.types";

export interface FormValues extends WizardState {
  bannerImageFile?: FileList;
  logoImageFile?: FileList;
  showGrid?: boolean;
  columns?: number;
}

export interface DetailsFormProps {
  previous: TVenueWizard["previous"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any;
  editData?: WizardState;
}
