import { AnyVenue, Venue_v2 } from "types/venues";

import { WithId } from "utils/id";

export interface EntranceExperienceProps {
  venue: Venue_v2;
  sovereignVenue?: WithId<AnyVenue>;
  onSave: () => void;
}
