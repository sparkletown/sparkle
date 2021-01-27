import { WithId } from "utils/id";
import { User } from "types/User";
import { AnyVenue, VenueEvent } from "types/venues";

export interface OnlineStatsData {
  onlineUsers: Array<WithId<User>>;
  openVenues: Array<{
    venue: WithId<AnyVenue>;
    currentEvents: Array<VenueEvent>;
  }>;
}
