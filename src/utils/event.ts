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

import { WorldEvent } from "types/venues";

import { getDayInterval } from "./time";

type EventStartTimeOptions = {
  event: WorldEvent;
  defaultStartTime?: Date;
};

type EventEndTimeOptions = {
  event: WorldEvent;
  defaultDuration?: number;
};

export const isEventLive = (event: WorldEvent) => {
  if (!event?.startUtcSeconds) {
    return false;
  }

  return isWithinInterval(Date.now(), getEventInterval(event));
};

export const isEventFuture = (event: WorldEvent) =>
  isFuture(fromUnixTime(event.startUtcSeconds));

export const isEventLater = (event: WorldEvent) =>
  isEventFuture(event) &&
  !isEventStartingSoon(event, EVENT_STARTING_SOON_TIMEFRAME);

export const isEventSoon = (event: WorldEvent) =>
  isEventFuture(event) &&
  isEventStartingSoon(event, EVENT_STARTING_SOON_TIMEFRAME);

export const isEventLiveOrFuture = (event: WorldEvent) =>
  isEventLive(event) || isEventFuture(event);

export const hasEventFinished = (event: WorldEvent) =>
  isAfter(Date.now(), eventEndTime({ event }));

export const eventStartTime = ({
  event,
  defaultStartTime,
}: EventStartTimeOptions) =>
  fromUnixTime(event?.startUtcSeconds ?? defaultStartTime);

export const eventEndTime = ({ event, defaultDuration }: EventEndTimeOptions) =>
  addMinutes(
    eventStartTime({ event }),
    event?.durationMinutes ?? defaultDuration
  );

export const isEventStartingSoon = (
  event: WorldEvent,
  rangeInMinutes: number | undefined = 60
) =>
  differenceInMinutes(eventStartTime({ event }), Date.now()) <= rangeInMinutes;

export const getEventInterval = (event: WorldEvent) => ({
  start: eventStartTime({ event, defaultStartTime: new Date() }),
  end: eventEndTime({ event, defaultDuration: 1 }),
});

export const isEventWithinDate = (checkDate: Date | number) => (
  event: WorldEvent
) =>
  areIntervalsOverlapping(getDayInterval(checkDate), getEventInterval(event));

export const isEventWithinDateAndNotFinished = (checkDate: Date | number) => (
  event: WorldEvent
) => isEventWithinDate(checkDate)(event) && !hasEventFinished(event);

export const eventsByStartUtcSecondsSorter = (a: WorldEvent, b: WorldEvent) =>
  a.startUtcSeconds - b.startUtcSeconds;

export const eventTimeComparator = (a: WorldEvent, b: WorldEvent) => {
  if (a.startUtcSeconds !== b.startUtcSeconds) {
    return eventsByStartUtcSecondsSorter(a, b);
  }

  return a.durationMinutes - b.durationMinutes;
};

export const eventTimeAndOrderComparator = (a: WorldEvent, b: WorldEvent) => {
  const aOrderPriority = a.orderPriority ?? 0;
  const bOrderPriority = b.orderPriority ?? 0;

  if (aOrderPriority === bOrderPriority) {
    return eventTimeComparator(a, b);
  } else {
    return bOrderPriority - aOrderPriority;
  }
};
