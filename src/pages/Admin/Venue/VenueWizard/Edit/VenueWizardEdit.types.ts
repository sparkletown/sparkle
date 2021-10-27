import { WizardAction, WizardState } from "../redux";

export interface VenueWizardEditProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  venueId: string;
}
