import { DEFAULT_VENUE_LOGO } from "settings";

import { MyPersonalizedSchedule } from "types/User";
import { AnyVenue, ScheduledVenueEvent, VenueEvent } from "types/venues";
import { WorldSlug } from "types/world";

import { WithId, WithVenueId } from "utils/id";
import { arrayIncludes } from "utils/types";

export interface PrepareForScheduleProps {
  usersEvents: MyPersonalizedSchedule;
  relatedVenues: WithId<AnyVenue>[];
  recentRoomUsersCount?: number;
  worldSlug?: WorldSlug;
}

export const prepareForSchedule = ({
  usersEvents,
  relatedVenues = [],
  recentRoomUsersCount = 0,
}: PrepareForScheduleProps) => (
  event: WithVenueId<VenueEvent>
): ScheduledVenueEvent => {
  const space = relatedVenues.find(({ id }) => id === event.venueId);
  return {
    ...event,
    isSaved: arrayIncludes(usersEvents[event.venueId], event.id),
    venueIcon: space?.host?.icon ?? DEFAULT_VENUE_LOGO,
    liveAudience: recentRoomUsersCount,
    orderPriority: event.orderPriority ?? 0,
  };
};
