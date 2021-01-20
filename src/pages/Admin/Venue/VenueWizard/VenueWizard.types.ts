// Typings
import { WizardAction } from "./redux/types";

export type TVenueWizard = {
  next?: (action: WizardAction) => void;
  previous?: () => void;
};
