import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  fromUnixTime,
  isAfter,
  isFuture,
  isWithinInterval,
} from "date-fns";

import { EVENT_STARTING_SOON_TIMEFRAME } from "settings";

import { VenueEvent } from "types/venues";

import {
  formatUtcSecondsRelativeToNow,
  getCurrentTimeInUTCSeconds,
  getDayInterval,
} from "./time";

type EventStartTimeOptions = {
  event: VenueEvent;
  defaultStartTime?: Date;
};

type EventEndTimeOptions = {
  event: VenueEvent;
  defaultDuration?: number;
};

export const getCurrentEvent = (roomEvents: VenueEvent[]) =>
  roomEvents.find(isEventLive);

export const isEventLive = (event: VenueEvent) => {
  if (!event?.start_utc_seconds) {
    return false;
  }

  return isWithinInterval(Date.now(), getEventInterval(event));
};

export const isEventFuture = (event: VenueEvent) =>
  isFuture(fromUnixTime(event.start_utc_seconds));

export const isEventLater = (event: VenueEvent) =>
  isEventFuture(event) &&
  !isEventStartingSoon(event, EVENT_STARTING_SOON_TIMEFRAME);

export const isEventSoon = (event: VenueEvent) =>
  isEventFuture(event) &&
  isEventStartingSoon(event, EVENT_STARTING_SOON_TIMEFRAME);

export const isEventLiveOrFuture = (event: VenueEvent) =>
  isEventLive(event) || isEventFuture(event);

export const eventHappeningNow = (
  roomName: string,
  venueEvents: VenueEvent[]
) => {
  const currentTimeInUTCSeconds = getCurrentTimeInUTCSeconds();

  return venueEvents.find(
    (event) =>
      event.room === roomName &&
      event.start_utc_seconds < currentTimeInUTCSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInUTCSeconds
  );
};

export const hasEventFinished = (event: VenueEvent) =>
  isAfter(Date.now(), eventEndTime({ event }));

export const eventStartTime = ({
  event,
  defaultStartTime,
}: EventStartTimeOptions) =>
  fromUnixTime(event?.start_utc_seconds ?? defaultStartTime);

export const eventEndTime = ({ event, defaultDuration }: EventEndTimeOptions) =>
  addMinutes(
    eventStartTime({ event }),
    event?.duration_minutes ?? defaultDuration
  );

export const isEventStartingSoon = (
  event: VenueEvent,
  rangeInMinutes: number | undefined = 60
) =>
  differenceInMinutes(eventStartTime({ event }), Date.now()) <= rangeInMinutes;

export const getEventInterval = (event: VenueEvent) => ({
  start: eventStartTime({ event, defaultStartTime: new Date() }),
  end: eventEndTime({ event, defaultDuration: 1 }),
});

export const isEventWithinDate = (checkDate: Date | number) => (
  event: VenueEvent
) =>
  areIntervalsOverlapping(getDayInterval(checkDate), getEventInterval(event));

export const isEventWithinDateAndNotFinished = (checkDate: Date | number) => (
  event: VenueEvent
) => isEventWithinDate(checkDate)(event) && !hasEventFinished(event);

export const getEventStatus = (event: VenueEvent) => {
  if (isEventLive(event)) return `Happening now`;

  if (hasEventFinished(event)) {
    return `Ended`;
  } else {
    return `Starts ${formatUtcSecondsRelativeToNow(event.start_utc_seconds)}`;
  }
};

export const eventsByStartUtcSecondsSorter = (a: VenueEvent, b: VenueEvent) =>
  a.start_utc_seconds - b.start_utc_seconds;

export const eventTimeComparator = (a: VenueEvent, b: VenueEvent) => {
  if (a.start_utc_seconds !== b.start_utc_seconds) {
    return eventsByStartUtcSecondsSorter(a, b);
  }

  return a.duration_minutes - b.duration_minutes;
};

export const eventTimeAndOrderComparator = (a: VenueEvent, b: VenueEvent) => {
  const aOrderPriority = a.orderPriority ?? 0;
  const bOrderPriority = b.orderPriority ?? 0;

  if (aOrderPriority === bOrderPriority) {
    return eventTimeComparator(a, b);
  } else {
    return bOrderPriority - aOrderPriority;
  }
};
