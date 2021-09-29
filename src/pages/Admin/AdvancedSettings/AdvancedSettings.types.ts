import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

export interface AdvancedSettingsProps {
  venue: WithId<AnyVenue>;
  onSave: () => void;
}
