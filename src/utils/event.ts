import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInHours,
  endOfDay,
  fromUnixTime,
  isWithinInterval,
  startOfDay,
} from "date-fns";

import { VenueEvent } from "types/venues";

import { getCurrentTimeInUTCSeconds } from "./time";

export const getCurrentEvent = (roomEvents: VenueEvent[]) => {
  const currentTimeInUTCSeconds = getCurrentTimeInUTCSeconds();

  return roomEvents.find(
    (event) =>
      event.start_utc_seconds < currentTimeInUTCSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInUTCSeconds
  );
};

export const isEventLive = (event: VenueEvent) => {
  return isWithinInterval(Date.now(), getEventInterval(event));
};

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

export const eventStartTime = (event: VenueEvent) =>
  fromUnixTime(event.start_utc_seconds);

export const eventEndTime = (event: VenueEvent) =>
  addMinutes(eventStartTime(event), event.duration_minutes);

export const isEventStartingSoon = (event: VenueEvent) =>
  differenceInHours(eventStartTime(event), Date.now()) <= 0;

export const getEventInterval = (event: VenueEvent) => ({
  start: eventStartTime(event),
  end: eventEndTime(event),
});

export const isEventWithinDate = (checkDate: number | Date) => (
  event: VenueEvent
) => {
  const checkDateInterval = {
    start: startOfDay(checkDate),
    end: endOfDay(checkDate),
  };

  const eventInterval = getEventInterval(event);

  return areIntervalsOverlapping(checkDateInterval, eventInterval);
};
