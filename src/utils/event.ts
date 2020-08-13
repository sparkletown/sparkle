import { VenueEvent } from "types/VenueEvent";

export const getCurrentEvent = (roomEvents: VenueEvent[]) => {
  const currentTimeInSeconds = new Date().getTime() / 1000;
  return roomEvents.find(
    (event) =>
      event.start_utc_seconds < currentTimeInSeconds &&
      event.start_utc_seconds + event.duration_minutes > currentTimeInSeconds
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
