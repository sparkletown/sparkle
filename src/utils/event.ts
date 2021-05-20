import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  endOfToday,
  fromUnixTime,
  isAfter,
  isWithinInterval,
} from "date-fns";

import { VenueEvent } from "types/venues";

import { getCurrentTimeInUTCSeconds, getDayInterval } from "./time";

export const getCurrentEvent = (roomEvents: VenueEvent[]) => {
  const currentTimeInUTCSeconds = getCurrentTimeInUTCSeconds();

  return roomEvents.find(
    (event) =>
      event.start_utc_seconds < currentTimeInUTCSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInUTCSeconds
  );
};

export const isEventLive = (event: VenueEvent) =>
  isWithinInterval(Date.now(), getEventInterval(event));

export const isEventLiveOrFuture = (event: VenueEvent) => {
  const currentTimeInUTCSeconds = getCurrentTimeInUTCSeconds();

  return (
    isEventLive(event) || event.start_utc_seconds > currentTimeInUTCSeconds
  );
};

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

export const isEventLaterToday = (event: VenueEvent) => {
  const laterTodayInterval = {
    start: Date.now(),
    end: endOfToday(),
  };

  return areIntervalsOverlapping(laterTodayInterval, getEventInterval(event));
};
