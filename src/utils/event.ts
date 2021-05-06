import { addMinutes, isWithinInterval } from "date-fns";

import { VenueEvent } from "types/venues";

import { getCurrentTimeInUTCSeconds, ONE_SECOND_IN_MILLISECONDS } from "./time";

export const getCurrentEvent = (roomEvents: VenueEvent[]) => {
  const currentTimeInUTCSeconds = getCurrentTimeInUTCSeconds();

  return roomEvents.find(
    (event) =>
      event.start_utc_seconds < currentTimeInUTCSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInUTCSeconds
  );
};

export const isEventLive = (event: VenueEvent) => {
  const start = event.start_utc_seconds * ONE_SECOND_IN_MILLISECONDS;
  const end = addMinutes(start, event.duration_minutes);

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
