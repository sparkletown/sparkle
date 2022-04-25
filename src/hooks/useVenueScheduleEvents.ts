import { useMemo } from "react";
import {
  differenceInDays,
  fromUnixTime,
  getUnixTime,
  isFuture,
  max,
  minutesToSeconds,
  secondsToMilliseconds,
  startOfDay,
  startOfToday,
} from "date-fns";

import { WorldEvent } from "types/venues";

import { isEventLiveOrFuture } from "utils/event";
import { isDateRangeStartWithinToday } from "utils/time";

import { prepareForSchedule } from "components/organisms/NavBarSchedule/utils";

import { useWorldBySlug } from "./worlds/useWorldBySlug";
import { useWorldParams } from "./worlds/useWorldParams";
import { useSpaceEvents } from "./events";
import { useRelatedVenues } from "./useRelatedVenues";

// @debt shared mutable value should most likely be replaced with ALWAYS_EMPTY_ARRAY
const emptyRelatedEvents: WorldEvent[] = [];
const todaysDate = startOfToday();

const useVenueScheduleEvents = ({
  userEventIds,
}: {
  userEventIds: Partial<Record<string, string[]>>;
}) => {
  const {
    descendantVenues,
    relatedVenueIds,
    isLoading,
    sovereignVenue,
    relatedVenues,
  } = useRelatedVenues();

  const { worldSlug } = useWorldParams();
  const { world } = useWorldBySlug(worldSlug);

  const {
    events: relatedVenueEvents = emptyRelatedEvents,
    isLoaded: isEventsLoaded,
  } = useSpaceEvents({
    worldId: world?.id,
    spaceIds: relatedVenueIds,
  });
  const liveAndFutureEvents = useMemo(
    () =>
      relatedVenueEvents.filter(isEventLiveOrFuture).map(
        prepareForSchedule({
          worldSlug,
          relatedVenues: descendantVenues,
          usersEvents: userEventIds,
        })
      ),
    [relatedVenueEvents, descendantVenues, worldSlug, userEventIds]
  );

  const liveEventsMinimalStartValue = Math.min(
    ...liveAndFutureEvents.map((event) => event.startUtcSeconds)
  );

  const minDateUtcSeconds = secondsToMilliseconds(liveEventsMinimalStartValue);

  const firstRangeDateInSeconds = secondsToMilliseconds(
    getUnixTime(max([minDateUtcSeconds, todaysDate.getTime()]))
  );

  const isMinDateWithinToday = isDateRangeStartWithinToday({
    dateValue: firstRangeDateInSeconds,
  });

  const maxDate = useMemo(
    () =>
      Math.max(
        ...liveAndFutureEvents.map((event) =>
          secondsToMilliseconds(
            event.startUtcSeconds + minutesToSeconds(event.durationMinutes)
          )
        ),
        // + 1 is needed to form a `daysInBetween` timeline and mitigate possible range error
        firstRangeDateInSeconds + 1
      ),
    [liveAndFutureEvents, firstRangeDateInSeconds]
  );

  const endScheduleDate =
    sovereignVenue?.end_utc_seconds &&
    isFuture(fromUnixTime(sovereignVenue.end_utc_seconds))
      ? sovereignVenue.end_utc_seconds
      : undefined;

  const daysInBetween = differenceInDays(
    new Date(endScheduleDate || maxDate),
    startOfDay(firstRangeDateInSeconds)
  );

  // +1 to include the latest day in the schedule (for example, there are events tomorrow and today -> tomorrow - today + 1 = 2 days)
  // might be NaN, which we need to convert to 0
  const dayDifference = daysInBetween ? daysInBetween + 1 : 0;

  const firstScheduleDate = useMemo(
    () => (isMinDateWithinToday ? todaysDate : new Date(minDateUtcSeconds)),
    [isMinDateWithinToday, minDateUtcSeconds]
  );

  return {
    firstScheduleDate,
    dayDifference,
    liveAndFutureEvents,
    descendantVenues,
    isEventsLoading: isLoading || !isEventsLoaded,
    sovereignVenue,
    relatedVenues,
  };
};

export default useVenueScheduleEvents;
