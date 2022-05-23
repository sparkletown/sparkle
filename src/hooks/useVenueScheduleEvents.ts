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

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { WorldEvent } from "types/venues";

import { isEventLiveOrFuture } from "utils/event";
import { isDateRangeStartWithinToday } from "utils/time";

import { prepareForSchedule } from "components/organisms/NavBarSchedule/utils";

import { useWorldAndSpaceByParams } from "./spaces/useWorldAndSpaceByParams";
import { useWorldParams } from "./worlds/useWorldParams";
import { useSpaceEvents } from "./events";
import { useRelatedVenues } from "./useRelatedVenues";

// @debt shared mutable value should most likely be replaced with ALWAYS_EMPTY_ARRAY
const emptyRelatedEvents: WorldEvent[] = [];
const todaysDate = startOfToday();

const useVenueScheduleEvents = ({
  userEventIds = ALWAYS_EMPTY_OBJECT,
}: {
  userEventIds?: Partial<Record<string, string[]>> | {};
} = {}) => {
  const { isLoading, worldSpaces, worldSpacesById } = useRelatedVenues();

  const { worldSlug } = useWorldParams();
  const { space, world } = useWorldAndSpaceByParams();

  const {
    events: relatedVenueEvents = emptyRelatedEvents,
    isLoaded: isEventsLoaded,
  } = useSpaceEvents({
    worldId: world?.id,
    spaceIds: Object.keys(worldSpacesById),
  });
  const liveAndFutureEvents = useMemo(
    () =>
      relatedVenueEvents.filter(isEventLiveOrFuture).map(
        prepareForSchedule({
          worldSlug,
          relatedVenues: worldSpaces,
          usersEvents: userEventIds,
        })
      ),
    [relatedVenueEvents, worldSlug, worldSpaces, userEventIds]
  );

  const liveEventsMinimalStartValue = liveAndFutureEvents.length
    ? Math.min(...liveAndFutureEvents.map((event) => event.startUtcSeconds))
    : todaysDate.getTime();
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
    space?.end_utc_seconds && isFuture(fromUnixTime(space.end_utc_seconds))
      ? space.end_utc_seconds
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
    isEventsLoading: isLoading || !isEventsLoaded,
    worldSpaces,
  };
};

export default useVenueScheduleEvents;
