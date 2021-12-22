import { DEFAULT_SHOW_SCHEDULE } from "settings";

import { World } from "api/world";

export const shouldScheduleBeShown = (world?: World) =>
  world?.showSchedule ?? DEFAULT_SHOW_SCHEDULE;
