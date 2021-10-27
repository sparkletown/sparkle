import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { WizardAction, WizardState } from "../Venue/VenueWizard/redux";

export interface DetailsProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  venue?: WithId<AnyVenue>;
}
