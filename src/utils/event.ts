import {
  addMinutes,
  differenceInHours,
  fromUnixTime,
  isWithinInterval,
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
  const start = eventStartTime(event);
  const end = eventEndTime(event);

  return isWithinInterval(Date.now(), { start, end });
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

export const moreThanHourLeftBeforeEventStarts = (event: VenueEvent) =>
  differenceInHours(eventStartTime(event), Date.now()) > 0;
