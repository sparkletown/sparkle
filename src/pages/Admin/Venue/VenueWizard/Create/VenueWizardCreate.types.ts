import { WizardAction, WizardState } from "../redux";

export interface VenueWizardCreateProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  onSave?: () => void;
}
