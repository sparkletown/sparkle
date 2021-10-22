import React from "react";

import { WizardAction, WizardState } from "../redux";

export interface VenueWizardEditProps {
  worldId: string;
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}
