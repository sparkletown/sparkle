import { VenueEvent } from "types/VenueEvent";
import { getCurrentTimeInUTCSeconds } from "./time";

export const getCurrentEvent = (roomEvents: VenueEvent[]) => {
  const currentTimeInSeconds = new Date().getTime() / 1000;
  return roomEvents.find(
    (event) =>
      event.start_utc_seconds < currentTimeInSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInSeconds
  );
};

export const isEventLive = (event: VenueEvent) => {
  const currentTimeInUTCSeconds = getCurrentTimeInUTCSeconds();

  return (
    event.start_utc_seconds < currentTimeInUTCSeconds &&
    event.start_utc_seconds + event.duration_minutes * 60 >
      currentTimeInUTCSeconds
  );
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
  const currentTimeInSeconds = new Date().getTime() / 1000;
  return venueEvents.find(
    (event) =>
      event.room === roomName &&
      event.start_utc_seconds < currentTimeInSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInSeconds
  );
};
