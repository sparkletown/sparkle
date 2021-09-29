import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

export interface EntranceExperienceProps {
  venue: WithId<AnyVenue>;
  sovereignVenue?: WithId<AnyVenue>;
  onSave: () => void;
}
