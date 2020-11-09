import { WizardState } from "../Venue/VenueWizard/redux";

export interface DetailsProps {
  previous?: () => void;
  venueId?: string;
  data?: WizardState;
  dispatch: any;
}
