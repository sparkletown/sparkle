import { SCHEDULE_HOUR_COLUMN_WIDTH_PX } from "settings";

import { getSecondsFromStartOfDay, ONE_HOUR_IN_SECONDS } from "utils/time";

export const calcStartPosition = (
  startTimeUtcSeconds: number,
  scheduleStartHour: number
) => {
  const startTimeSeconds = getSecondsFromStartOfDay(startTimeUtcSeconds);
  // @debt ONE_HOUR_IN_SECONDS is deprecated; use utils/time or date-fns function instead
  const hoursToSkip =
    startTimeSeconds / ONE_HOUR_IN_SECONDS - scheduleStartHour;
  const halfHourWidth = SCHEDULE_HOUR_COLUMN_WIDTH_PX / 2;

  return Math.floor(
    halfHourWidth + hoursToSkip * SCHEDULE_HOUR_COLUMN_WIDTH_PX
  );
};
