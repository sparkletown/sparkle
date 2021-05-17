import {
  differenceInSeconds,
  format,
  formatDuration,
  formatRelative,
  fromUnixTime,
  getUnixTime,
  intervalToDuration,
  isBefore,
  startOfDay,
} from "date-fns";

/**
 * @deprecated in favor of using date-fns functions
 */
export const ONE_SECOND_IN_MILLISECONDS = 1000;
/**
 * @deprecated in favor of using date-fns functions
 */
export const ONE_MINUTE_IN_SECONDS = 60;
/**
 * @deprecated in favor of using date-fns functions
 */
export const ONE_HOUR_IN_MINUTES = 60;
/**
 * @deprecated in favor of using date-fns functions
 */
export const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
/**
 * @deprecated in favor of using date-fns functions
 */
export const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

/**
 * @deprecated in favor of using date-fns functions
 */
export const FIVE_MINUTES_MS =
  5 * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MILLISECONDS;

/**
 * @deprecated in favor of using date-fns functions
 */
export const ONE_HOUR_IN_MILLISECONDS =
  ONE_SECOND_IN_MILLISECONDS * ONE_HOUR_IN_SECONDS;
/**
 * @deprecated in favor of using date-fns functions
 */
export const SECONDS_TIMESTAMP_MAX_VALUE = 9999999999;

/**
 * Convert totalSeconds to a Duration object (days, hours, minutes, seconds).
 *
 * @param totalSeconds
 *
 * @see https://date-fns.org/docs/Duration
 *
 * @debt replace this with better implementation using `intervalToDuration` (see link) once we upgrade date-fns beyond v2.13.0
 * @see https://github.com/date-fns/date-fns/issues/229#issuecomment-646124041
 */
export const secondsToDuration = (totalSeconds: number): Duration => {
  const days = Math.floor(totalSeconds / ONE_DAY_IN_SECONDS);
  const remainingSecondsWithoutDays = totalSeconds % ONE_DAY_IN_SECONDS;

  const hours = Math.floor(remainingSecondsWithoutDays / ONE_HOUR_IN_SECONDS);
  const remainingSecondsWithoutHours =
    remainingSecondsWithoutDays % ONE_HOUR_IN_SECONDS;

  const minutes = Math.floor(
    remainingSecondsWithoutHours / ONE_MINUTE_IN_SECONDS
  );
  const remainingSecondsWithoutMinutes =
    remainingSecondsWithoutHours % ONE_MINUTE_IN_SECONDS;

  return { days, hours, minutes, seconds: remainingSecondsWithoutMinutes };
};

/**
 * Format seconds as a string representing the Duration.
 *
 * @example
 *   formatSecondsAsDuration(1000000)
 *   // 11 days 13 hours 46 minutes 40 seconds
 *
 * @param seconds total seconds to be formatted as a duration
 */
export const formatSecondsAsDuration = (seconds: number): string =>
  formatDuration(secondsToDuration(seconds));

export const getTimeBeforeParty = (startUtcSeconds?: number) => {
  if (startUtcSeconds === undefined) return "???";

  const eventStartDate = fromUnixTime(startUtcSeconds);
  const now = Date.now();

  if (isBefore(eventStartDate, now)) return 0;

  return formatDuration(
    intervalToDuration({
      start: Date.now(),
      end: eventStartDate,
    }),
    { format: ["days", "hours", "minutes"] }
  );
};

/**
 * Format UTC seconds as a string representing date.
 *
 * @example
 *   formatDate(1618509600)
 *   // 'Apr 15th'
 *
 * @param utcSeconds
 *
 * @see https://date-fns.org/docs/format
 */
export function formatDate(utcSeconds: number) {
  return format(fromUnixTime(utcSeconds), "MMM do");
}

export function oneHourAfterTimestamp(timestamp: number) {
  return timestamp + ONE_HOUR_IN_SECONDS;
}

/**
 * Format UTC seconds as a string representing time.
 *
 * @example
 *   formatUtcSeconds(1618509600)
 *   // '9:00 PM'
 *
 * @param utcSeconds
 *
 * @see https://date-fns.org/docs/format
 */
export function formatUtcSeconds(utcSeconds?: number | null) {
  return utcSeconds ? format(fromUnixTime(utcSeconds), "p") : "(unknown)";
}

export function getHoursAgoInSeconds(hours: number) {
  const nowInSec = getUnixTime(Date.now());
  return nowInSec - hours * ONE_HOUR_IN_SECONDS;
}

export const getHoursAgoInMilliseconds = (hours: number) =>
  Date.now() - hours * ONE_HOUR_IN_MILLISECONDS;

export const getCurrentTimeInMilliseconds = () => Date.now();

export function getDaysAgoInSeconds(days: number) {
  return getHoursAgoInSeconds(days * 24);
}

/**
 * Format UTC seconds as a string representing time in the format hh:mm.
 *
 * @example
 *   formatHourAndMinute(1618509600)
 *   // '21:00'
 *
 * @param utcSeconds
 *
 * @see https://date-fns.org/docs/format
 */
export const formatHourAndMinute = (utcSeconds: number) => {
  return format(fromUnixTime(utcSeconds), "HH:mm");
};

export const getSecondsFromStartOfDay = (utcSeconds: number) => {
  const time = fromUnixTime(utcSeconds);

  return differenceInSeconds(time, startOfDay(time));
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
//   The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
export const getCurrentTimeInUTCSeconds = () => getUnixTime(Date.now());

/**
 * Format UTC seconds as a string representing relative date from now.
 *
 * @example
 *   formatUtcSecondsRelativeToNow(1618509600)
 *   // 'today at 9:00 PM'
 *
 * @param utcSeconds
 *
 * @see https://date-fns.org/docs/formatRelative
 */
export const formatUtcSecondsRelativeToNow = (utcSeconds: number) => {
  return formatRelative(fromUnixTime(utcSeconds), Date.now());
};

// @debt get rid of ONE_SECOND_IN_MILLISECONDS and use date-fns function
export const normalizeTimestampToMilliseconds = (timestamp: number) => {
  const isTimestampInMilliSeconds = timestamp > SECONDS_TIMESTAMP_MAX_VALUE;

  return isTimestampInMilliSeconds
    ? timestamp
    : timestamp * ONE_SECOND_IN_MILLISECONDS;
};
