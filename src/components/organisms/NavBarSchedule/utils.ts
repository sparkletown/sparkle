import { DEFAULT_VENUE_LOGO } from "settings";

import { MyPersonalizedSchedule } from "types/User";
import { AnyVenue, ScheduledVenueEvent, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { arrayIncludes } from "utils/types";

export interface PrepareForScheduleProps {
  usersEvents: MyPersonalizedSchedule;
  relatedVenues: WithId<AnyVenue>[];
}

export const prepareForSchedule = ({
  usersEvents,
  relatedVenues = [],
}: PrepareForScheduleProps) => (
  event: WithVenueId<VenueEvent>
): ScheduledVenueEvent => {
  return {
    ...event,
    isSaved: arrayIncludes(usersEvents[event.venueId], event.id),
    venueIcon:
      relatedVenues.find((venue) => venue.id === event.venueId)?.host?.icon ??
      DEFAULT_VENUE_LOGO,
  };
};
