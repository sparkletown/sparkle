import { Room } from "types/rooms";
import { PersonalizedVenueEvent } from "types/venues";
import { WithVenueId } from "utils/id";

export type RoomWithEvents = Room & {
  events: WithVenueId<PersonalizedVenueEvent>[];
};

export interface ScheduleDay {
  isToday: boolean;
  weekday: string;
  dayStartUtcSeconds: number;
  rooms: RoomWithEvents[];
  personalEvents: WithVenueId<PersonalizedVenueEvent>[];
}

export interface ScheduleProps {
  scheduleDay: ScheduleDay;
}
