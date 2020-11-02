// Typings
import { WizardAction } from "./redux/types";

export type VenueWizard = {
  next?: (action: WizardAction) => void;
  previous?: () => void;
}
