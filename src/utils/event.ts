import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  fromUnixTime,
  isAfter,
  isFuture,
  isWithinInterval,
} from "date-fns";

import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "./id";

import {
  formatUtcSecondsRelativeToNow,
  getCurrentTimeInUTCSeconds,
  getDayInterval,
} from "./time";

export const getCurrentEvent = (roomEvents: VenueEvent[]) =>
  roomEvents.find(isEventLive);

export const isEventLive = (event: VenueEvent) =>
  isWithinInterval(Date.now(), getEventInterval(event));

export const isEventFuture = (event: VenueEvent) =>
  isFuture(fromUnixTime(event.start_utc_seconds));

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
  isAfter(Date.now(), eventEndTime(event));

export const eventStartTime = (event: VenueEvent) =>
  fromUnixTime(event.start_utc_seconds);

export const eventEndTime = (event: VenueEvent) =>
  addMinutes(eventStartTime(event), event.duration_minutes);

export const isEventStartingSoon = (event: VenueEvent) =>
  differenceInMinutes(eventStartTime(event), Date.now()) <= 60;

export const getEventInterval = (event: VenueEvent) => ({
  start: eventStartTime(event),
  end: eventEndTime(event),
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

export const eventSort = (a: VenueEvent, b: VenueEvent) => a.start_utc_seconds - b.start_utc_seconds
