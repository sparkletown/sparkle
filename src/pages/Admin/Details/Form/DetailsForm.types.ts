import React from "react";

import { WizardAction, WizardState } from "pages/Admin/Venue/VenueWizard/redux";
import { TVenueWizard } from "pages/Admin/Venue/VenueWizard/VenueWizard.types";

export interface FormValues extends WizardState {
  name: string;
  bannerImageFile?: FileList;
  logoImageFile?: FileList;
  showGrid?: boolean;
  columns?: number;
  worldId?: string;
}

export interface DetailsFormProps {
  previous: TVenueWizard["previous"];
  dispatch: React.Dispatch<WizardAction>;
  editData?: WizardState;
}
