import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { WizardAction, WizardState } from "pages/Admin/Venue/VenueWizard/redux";

export interface FormValues extends WizardState {
  name: string;
  bannerImageFile?: FileList;
  logoImageFile?: FileList;
  showGrid?: boolean;
  columns?: number;
  worldId?: string;
  parentId?: string;
}

export interface DetailsFormProps {
  dispatch: React.Dispatch<WizardAction>;
  venue?: WithId<AnyVenue>;
}
