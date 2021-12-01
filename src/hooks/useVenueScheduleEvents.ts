import { useMemo } from "react";
import {
  differenceInDays,
  fromUnixTime,
  getUnixTime,
  isFuture,
  max,
  millisecondsToSeconds,
  minutesToSeconds,
  secondsToMilliseconds,
  startOfToday,
} from "date-fns";

import { EMPTY_WORLD_SLUG } from "settings";

import { VenueEvent } from "types/venues";

import { getEventDayRange, isEventLiveOrFuture } from "utils/event";
import { WithVenueId } from "utils/id";
import { isDateRangeStartWithinToday } from "utils/time";

import { prepareForSchedule } from "components/organisms/NavBarSchedule/utils";

import { useWorldParams } from "./worlds/useWorldParams";
import { useVenueEvents } from "./events";
import { useRelatedVenues } from "./useRelatedVenues";

const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];
const minRangeValue = 0;
const todaysDate = new Date();

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

  const {
    events: relatedVenueEvents = emptyRelatedEvents,
    isEventsLoading,
  } = useVenueEvents({
    venueIds: relatedVenueIds,
  });
  const liveAndFutureEvents = useMemo(
    () =>
      relatedVenueEvents.filter(isEventLiveOrFuture).map(
        prepareForSchedule({
          worldSlug: worldSlug ?? EMPTY_WORLD_SLUG,
          relatedVenues: descendantVenues,
          usersEvents: userEventIds,
        })
      ),
    [relatedVenueEvents, descendantVenues, worldSlug, userEventIds]
  );

  const liveEventsMinimalStartValue = Math.min(
    ...liveAndFutureEvents.map((event) => event.start_utc_seconds)
  );

  const firstLiveEvent = liveAndFutureEvents.find(
    (event) => event.start_utc_seconds === liveEventsMinimalStartValue
  );

  const minDateUtcSeconds = useMemo(
    () =>
      firstLiveEvent ? getUnixTime(liveEventsMinimalStartValue) : minRangeValue,
    [firstLiveEvent, liveEventsMinimalStartValue]
  );

  const isMinDateWithinToday = isDateRangeStartWithinToday({
    dateValue: secondsToMilliseconds(minDateUtcSeconds),
    targetDateValue: millisecondsToSeconds(startOfToday().getTime()),
  });

  const firstRangeDateInSeconds = getUnixTime(
    max([new Date(secondsToMilliseconds(minDateUtcSeconds)), todaysDate])
  );

  const isOneEventAndLive =
    secondsToMilliseconds(firstRangeDateInSeconds) <= todaysDate.getTime() &&
    liveAndFutureEvents.length === 1;

  const maxDate = useMemo(
    () =>
      Math.max(
        ...liveAndFutureEvents.map(
          (event) =>
            event.start_utc_seconds + minutesToSeconds(event.duration_minutes)
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
    fromUnixTime(endScheduleDate || maxDate),
    fromUnixTime(firstRangeDateInSeconds)
  );

  const dayDifference = getEventDayRange(daysInBetween, isOneEventAndLive);

  const firstScheduleDate = useMemo(
    () =>
      isMinDateWithinToday
        ? todaysDate
        : new Date(secondsToMilliseconds(minDateUtcSeconds)),
    [isMinDateWithinToday, minDateUtcSeconds]
  );

  return {
    firstScheduleDate,
    dayDifference,
    liveAndFutureEvents,
    descendantVenues,
    isEventsLoading: isLoading || isEventsLoading,
    sovereignVenue,
    relatedVenues,
  };
};

export default useVenueScheduleEvents;
