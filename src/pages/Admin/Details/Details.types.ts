import { WizardState } from "../Venue/VenueWizard/redux";

export interface DetailsProps {
  previous?: () => void;
  data?: WizardState;
  dispatch: unknown;
}
