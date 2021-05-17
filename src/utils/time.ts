import { format, formatDuration, formatRelative } from "date-fns";

import { VenueEvent } from "types/venues";

export const ONE_SECOND_IN_MILLISECONDS = 1000;
export const ONE_MINUTE_IN_SECONDS = 60;
export const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
export const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

export const FIVE_MINUTES_MS =
  5 * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MILLISECONDS;
export const ONE_HOUR_IN_MILLISECONDS =
  ONE_SECOND_IN_MILLISECONDS * ONE_HOUR_IN_SECONDS;

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

const formatMeasurementInString = (value: number, measureUnit: string) => {
  const baseFormatted = `${value} ${measureUnit}`;

  if (value === 0) return "";
  if (value === 1) return baseFormatted;
  if (value > 1) return `${baseFormatted}s`;
};

// @debt quality test this
export const getTimeBeforeParty = (startUtcSeconds?: number) => {
  if (startUtcSeconds === undefined) return "???";

  const secondsBeforeParty =
    startUtcSeconds - Date.now() / ONE_SECOND_IN_MILLISECONDS;

  if (secondsBeforeParty < 0) {
    return 0;
  }

  const numberOfCompleteDaysBeforeParty = Math.floor(
    secondsBeforeParty / ONE_DAY_IN_SECONDS
  );

  const numberOfCompleteHours = Math.floor(
    (secondsBeforeParty % ONE_DAY_IN_SECONDS) / ONE_HOUR_IN_SECONDS
  );

  const numberOfMinutes = Math.floor(
    (secondsBeforeParty % ONE_HOUR_IN_SECONDS) / ONE_MINUTE_IN_SECONDS
  );

  const numberOfDaysInString = formatMeasurementInString(
    numberOfCompleteDaysBeforeParty,
    "day"
  );
  const numberOfHoursInString = formatMeasurementInString(
    numberOfCompleteHours,
    "hour"
  );
  const numberOfMinutesInString = formatMeasurementInString(
    numberOfMinutes,
    "minute"
  );

  return `${numberOfDaysInString} ${numberOfHoursInString} ${numberOfMinutesInString}`;
};

export const canUserJoinTheEvent = (event: VenueEvent) =>
  event.start_utc_seconds - Date.now() / ONE_SECOND_IN_MILLISECONDS >
  ONE_HOUR_IN_SECONDS;

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
  return format(utcSeconds * ONE_SECOND_IN_MILLISECONDS, "MMM do");
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
  return utcSeconds
    ? format(utcSeconds * ONE_SECOND_IN_MILLISECONDS, "p")
    : "(unknown)";
}

export function getHoursAgoInSeconds(hours: number) {
  const nowInSec = Date.now() / ONE_SECOND_IN_MILLISECONDS;
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
  return format(utcSeconds * ONE_SECOND_IN_MILLISECONDS, "HH:mm");
};

export const daysFromEndOfEvent = (
  utcSeconds: number,
  durationMinutes: number
) => {
  const dateNow = new Date();
  const dateOfFinish = new Date(
    (utcSeconds + durationMinutes * 60) * ONE_SECOND_IN_MILLISECONDS
  );
  const differenceInTime = dateOfFinish.getTime() - dateNow.getTime();
  const differenceInDays =
    differenceInTime / (ONE_SECOND_IN_MILLISECONDS * 3600 * 24);
  return Math.round(differenceInDays);
};

export const daysFromStartOfEvent = (utcSeconds: number) => {
  const dateNow = new Date();
  const dateOfStart = new Date(utcSeconds * ONE_SECOND_IN_MILLISECONDS);
  const differenceInTime = dateNow.getTime() - dateOfStart.getTime();
  const differenceInDays =
    differenceInTime / (ONE_SECOND_IN_MILLISECONDS * 3600 * 24);
  return Math.round(differenceInDays);
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
//   The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
export const getCurrentTimeInUTCSeconds = () =>
  Date.now() / ONE_SECOND_IN_MILLISECONDS;

export const roundToNearestHour = (seconds: number) => {
  const oneHour = 60 * 60;
  return Math.floor(seconds / oneHour) * oneHour;
};

/**
 * Format UTC seconds as a string representing weekday abbreviation.
 *
 * @example
 *   formatDateToWeekday(1618509600)
 *   // 'Thu'
 *
 * @param utcSeconds
 *
 * @see https://date-fns.org/docs/format
 */
export function formatDateToWeekday(utcSeconds: number) {
  return format(utcSeconds * ONE_SECOND_IN_MILLISECONDS, "E");
}

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
  return formatRelative(utcSeconds * ONE_SECOND_IN_MILLISECONDS, Date.now());
};

export const normalizeTimestampToMilliseconds = (timestamp: number) => {
  const isTimestampInMilliSeconds = timestamp > SECONDS_TIMESTAMP_MAX_VALUE;

  return isTimestampInMilliSeconds
    ? timestamp
    : timestamp * ONE_SECOND_IN_MILLISECONDS;
};
