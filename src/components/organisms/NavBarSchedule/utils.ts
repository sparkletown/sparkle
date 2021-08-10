import { MyPersonalizedSchedule } from "types/User";
import { PersonalizedVenueEvent, VenueEvent } from "types/venues";

import { WithVenueId } from "utils/id";
import { arrayIncludes } from "utils/types";

export interface PrepareForScheduleProps {
  usersEvents: MyPersonalizedSchedule;
}

export const prepareForSchedule = ({
  usersEvents,
}: PrepareForScheduleProps) => (
  event: WithVenueId<VenueEvent>
): PersonalizedVenueEvent => {
  return {
    ...event,
    isSaved: arrayIncludes(usersEvents[event.venueId], event.id),
  };
};
