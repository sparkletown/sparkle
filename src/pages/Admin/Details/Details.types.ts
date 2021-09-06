import React from "react";

import { WizardAction, WizardState } from "../Venue/VenueWizard/redux";

export interface DetailsProps {
  previous?: () => void;
  data?: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}
