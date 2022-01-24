import { User } from "types/User";
import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";

export interface OnlineStatsData {
  onlineUsers: Array<WithId<User>>;
  openVenues: Array<{
    venue: WithId<AnyVenue>;
    currentEvents: Array<WorldEvent>;
  }>;
}
