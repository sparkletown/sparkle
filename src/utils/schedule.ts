import { LocationEvents } from "types/venues";

export const sortScheduleRoomsAlphabetically = (rooms: LocationEvents[]) => {
  return rooms.sort((a, b) => {
    const nameA =
      a.location.roomTitle ?? a.location.venueName ?? a.location.venueId;
    const nameB =
      b.location.roomTitle ?? b.location.venueName ?? b.location.venueId;

    return nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
};
