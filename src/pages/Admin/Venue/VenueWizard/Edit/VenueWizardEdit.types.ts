import { WizardAction, WizardState } from "../redux";

export interface VenueWizardEditProps {
  venueId: string;
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}
