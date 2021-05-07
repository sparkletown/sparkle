import { PersonalizedVenueEvent } from "types/venues";
import { RoomWithEvents } from "types/rooms";

import { WithVenueId } from "utils/id";

export interface ScheduleDay {
  isToday: boolean;
  weekday: string;
  dayStartUtcSeconds: number;
  rooms: RoomWithEvents[];
  personalEvents: WithVenueId<PersonalizedVenueEvent>[];
}
