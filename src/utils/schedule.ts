import { GITHUB_MAIN_STAGE_NAME } from "settings";
import { LocationEvents } from "types/venues";

export const sortScheduleRoomsAlphabetically = (rooms: LocationEvents[]) => {
  return rooms.sort((a, b) => {
    const nameA =
      a.location.roomTitle ?? a.location.venueName ?? a.location.venueId;
    const nameB =
      b.location.roomTitle ?? b.location.venueName ?? b.location.venueId;

    if (nameA === GITHUB_MAIN_STAGE_NAME) {
      return -1;
    }

    return nameA.localeCompare(nameB);
  });
};
