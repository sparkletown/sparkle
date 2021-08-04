import { LocationEvents } from "types/venues";

export const sortScheduleRoomsAlphabetically = (rooms: LocationEvents[]) => {
  return rooms.sort((a, b) => {
    const nameA =
      a.location.roomTitle ?? a.location.venueName ?? a.location.venueId;
    const nameB =
      b.location.roomTitle ?? b.location.venueName ?? b.location.venueId;

    return nameA.localeCompare(nameB);
  });
};

export const getScheduleTimelineNames = (d: string) => {
  const day = parseInt(d, 10);

  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};
