import { WizardState } from "../redux";

export interface VenueWizardEditProps {
  venueId: string;
  state: WizardState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any;
}
