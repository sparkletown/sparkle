import { AnyVenue } from "types/venues";
import { PersonalizedVenueEvent } from "types/venues";
import { WithVenueId } from "utils/id";

export type VenueWithEvents = AnyVenue & {
  events: WithVenueId<PersonalizedVenueEvent>[];
};

export interface ScheduleDay {
  isToday: boolean;
  weekday: string;
  dayStartUtcSeconds: number;
  venues: VenueWithEvents[];
  personalEvents: WithVenueId<PersonalizedVenueEvent>[];
}

export interface ScheduleProps {
  scheduleDay: ScheduleDay;
}
