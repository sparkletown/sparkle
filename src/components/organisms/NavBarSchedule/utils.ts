import { DEFAULT_VENUE_LOGO, PORTAL_INFO_ICON_MAPPING } from "settings";

import { MyPersonalizedSchedule } from "types/User";
import { AnyVenue, ScheduledEvent, WorldEvent } from "types/venues";
import { WorldSlug } from "types/world";

import { WithId } from "utils/id";
import { arrayIncludes } from "utils/types";

interface PrepareForScheduleProps {
  usersEvents: MyPersonalizedSchedule;
  relatedVenues: WithId<AnyVenue>[];
  recentRoomUsersCount?: number;
  worldSlug?: WorldSlug;
}

export const prepareForSchedule = ({
  usersEvents,
  relatedVenues = [],
  recentRoomUsersCount = 0,
}: PrepareForScheduleProps) => (event: WorldEvent): ScheduledEvent => {
  const space = relatedVenues.find(({ id }) => id === event.spaceId);
  return {
    ...event,
    isSaved: arrayIncludes(usersEvents[event.spaceId], event.id),
    venueIcon:
      space?.host?.icon ||
      PORTAL_INFO_ICON_MAPPING[space?.template ?? ""] ||
      DEFAULT_VENUE_LOGO,
    liveAudience: recentRoomUsersCount,
    orderPriority: event.orderPriority ?? 0,
  };
};
