import { WithId } from "utils/id";
import { User } from "types/User";
import { AnyVenue } from "./Firestore";
import { VenueEvent } from "./VenueEvent";

export interface OnlineStatsData {
  onlineUsers: Array<WithId<User>>;
  openVenues: Array<{
    venue: WithId<AnyVenue>;
    currentEvents: Array<VenueEvent>;
  }>;
}
