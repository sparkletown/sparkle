import { SCHEDULE_HOUR_COLUMN_WIDTH_PX } from "settings";

import { getSecondsFromStartOfDay, ONE_HOUR_IN_SECONDS } from "utils/time";

export const calcStartPosition = (
  startTimeUtcSeconds: number,
  scheduleStartHour: number
) => {
  const startTimeTodaySeconds = getSecondsFromStartOfDay(startTimeUtcSeconds);

  return Math.floor(
    SCHEDULE_HOUR_COLUMN_WIDTH_PX / 2 +
      (startTimeTodaySeconds / ONE_HOUR_IN_SECONDS - scheduleStartHour) *
        SCHEDULE_HOUR_COLUMN_WIDTH_PX
  );
};
