import { DEFAULT_SHOW_SCHEDULE } from "settings";

import { World } from "api/world";

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

export const shouldScheduleBeShown = (world?: World) =>
  world?.showSchedule ?? DEFAULT_SHOW_SCHEDULE;
