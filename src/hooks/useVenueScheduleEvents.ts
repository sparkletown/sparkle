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

import { WorldExperience } from "types/venues";

import { isEventLiveOrFuture } from "utils/event";
import { WithVenueId } from "utils/id";
import { isDateRangeStartWithinToday } from "utils/time";

import { prepareForSchedule } from "components/organisms/NavBarSchedule/utils";

import { useWorldParams } from "./worlds/useWorldParams";
import { useVenueEvents } from "./events";
import { useRelatedVenues } from "./useRelatedVenues";

const emptyRelatedEvents: WithVenueId<WorldExperience>[] = [];
const minRangeValue = 0;
const todaysDate = startOfToday();

const useVenueScheduleEvents = ({
  userEventIds,
  refetchIndex = 0,
}: {
  userEventIds: Partial<Record<string, string[]>>;
  refetchIndex?: number;
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
    refetchIndex,
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

  const firstLiveEvent = liveAndFutureEvents.find(
    (event) => event.startUtcSeconds === liveEventsMinimalStartValue
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

  const maxDate = useMemo(
    () =>
      Math.max(
        ...liveAndFutureEvents.map(
          (event) =>
            event.startUtcSeconds + minutesToSeconds(event.durationMinutes)
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

  // +1 to include the latest day in the schedule (for example, there are events tomorrow and today -> tomorrow - today + 1 = 2 days)
  const dayDifference = daysInBetween + 1;

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
