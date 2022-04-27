import { isWithinInterval } from "date-fns";

import { getEventInterval } from "utils/event";

import { WorldEvent } from "./AnimateMapVenues";

export const isEventLive = (event: WorldEvent) => {
  if (!event?.startUtcSeconds) {
    return false;
  }

  return isWithinInterval(Date.now(), getEventInterval(event));
};
