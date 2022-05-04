import {
  endOfDay,
  format,
  formatDuration,
  formatRelative,
  fromUnixTime,
  getTime,
  getUnixTime,
  intervalToDuration,
  isAfter,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  startOfToday,
  subHours,
} from "date-fns";

import {
  DATEFNS_INPUT_DATE_FORMAT,
  DATEFNS_INPUT_TIME_FORMAT,
  DAYJS_EVENT_WEEK_DAY_FORMAT,
} from "settings";

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
 * Format time left from now as a string representing the Duration ignoring seconds.
 *
 * @example
 *   getTimeBeforeParty(1626432204)
 *   // 1 month 26 days 20 hours 53 minutes
 *
 * @param startUtcSeconds
 *
 * @see https://date-fns.org/docs/formatDuration
 */
export const getTimeBeforeParty = (startUtcSeconds?: number): string => {
  if (startUtcSeconds === undefined) return "???";

  const startDate = fromUnixTime(startUtcSeconds);
  const now = Date.now();

  if (isAfter(now, startDate)) return "0";

  return formatDuration({
    ...intervalToDuration({
      start: now,
      end: startDate,
    }),
    seconds: 0,
  });
};

/**
 * Format dateOrTimestamp as a string representing date.
 *
 * @example
 *   formatDate(1623899620647)
 *   // 'Jun 17th'
 *
 * @param dateOrTimestamp
 *
 * @see https://date-fns.org/docs/format
 */
export const formatDate = (dateOrTimestamp: Date | number): string =>
  isThisYear(dateOrTimestamp)
    ? format(dateOrTimestamp, "MMM do")
    : format(dateOrTimestamp, "MMM do, yyyy");

export interface FormatDateRelativeToNowOptions {
  formatYesterday?: (dateOrTimestamp: Date | number) => string;
  formatToday?: (dateOrTimestamp: Date | number) => string;
  formatTomorrow?: (dateOrTimestamp: Date | number) => string;
  formatOtherDate?: (dateOrTimestamp: Date | number) => string;
}

/**
 * Format dateOrTimestamp as a string representing the date relative to now.
 *
 * These formats can be customised via the options prop if desired.
 *
 * @example Basic Usage
 *   formatDateRelativeToNow(yesterdayDate) // "Yesterday"
 *   formatDateRelativeToNow(todayDate)     // "Today"
 *   formatDateRelativeToNow(tomorrowDate)  // "Tomorrow"
 *   formatDateRelativeToNow(someOtherDate) // "Jun 17th"
 *
 * @example Customised Formats Usage
 *   formatDateRelativeToNow(todayDate, { formatToday: () => "All we have is now!" })
 *   // "All we have is now!"
 *
 * @param dateOrTimestamp
 * @param options
 *
 * @see https://date-fns.org/docs/format
 */
export const formatDateRelativeToNow = (
  dateOrTimestamp: Date | number,
  options?: FormatDateRelativeToNowOptions
): string => {
  const {
    formatYesterday = () => "Yesterday",
    formatToday = () => "Today",
    formatTomorrow = () => "Tomorrow",
    formatOtherDate = formatDate,
  } = options ?? {};

  if (isYesterday(dateOrTimestamp)) return formatYesterday(dateOrTimestamp);
  if (isToday(dateOrTimestamp)) return formatToday(dateOrTimestamp);
  if (isTomorrow(dateOrTimestamp)) return formatTomorrow(dateOrTimestamp);

  return formatOtherDate(dateOrTimestamp);
};

/**
 * Format dateOrTimestamp as a string representing the time in long localized time format (eg. 12:00 AM).
 *
 * @example
 *   formatTimestampToDisplayHoursMinutes(1623899620647)
 *   // '1:13 PM'
 *
 * @param dateOrTimestamp
 *
 * @see https://date-fns.org/docs/format
 */
export const formatTimeLocalised = (dateOrTimestamp: Date | number): string =>
  format(dateOrTimestamp, "p");

export const oneHourAfterTimestamp = (timestamp: number) =>
  timestamp + ONE_HOUR_IN_SECONDS;

export const getHoursAgoInMilliseconds = (hours: number) =>
  getTime(subHours(Date.now(), hours));

export const getCurrentTimeInMilliseconds = () => Date.now();

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
export const formatUtcSecondsRelativeToNow = (utcSeconds: number) =>
  formatRelative(fromUnixTime(utcSeconds), Date.now());

export const getDayInterval = (date: Date | number) => ({
  start: startOfDay(date),
  end: endOfDay(date),
});

export const isDateRangeStartWithinToday = ({
  dateValue,
}: {
  dateValue: number;
}) => dateValue <= startOfToday().getTime();

export type ConvertDateFromUtcSecondsResults = {
  date: Date;
  inputFormattedDateSegment: string;
  inputFormattedTimeSegment: string;
  isoFormattedFullDate: string;
  unixTime: number;
  utcSeconds: number | undefined;
};

export const convertDateFromUtcSeconds: (
  utcSeconds: number
) => ConvertDateFromUtcSecondsResults = (utcSeconds) => {
  // NOTE: easy to check if argument defaulted by comparing unixTime and utcSeconds from the result
  const unixTime = Number.isSafeInteger(utcSeconds)
    ? utcSeconds
    : Date.now() / 1000;

  const date = fromUnixTime(unixTime);

  const inputFormattedTimeSegment = format(date, DATEFNS_INPUT_TIME_FORMAT);
  const inputFormattedDateSegment = format(date, DATEFNS_INPUT_DATE_FORMAT);
  const isoFormattedFullDate = date.toISOString();

  return {
    date,
    inputFormattedDateSegment,
    inputFormattedTimeSegment,
    isoFormattedFullDate,
    unixTime,
    utcSeconds,
  };
};

export const convertUtcSecondsFromInputDateAndTime: (input: {
  date: string;
  time: string;
}) => number = ({ date, time }) => getUnixTime(new Date(`${date} ${time}`));

export const formatDayLabel = (
  day: Date | number,
  isScheduleTimeshifted: boolean
) => {
  if (isScheduleTimeshifted) {
    return format(day, DAYJS_EVENT_WEEK_DAY_FORMAT);
  }

  return formatDateRelativeToNow(day, {
    formatOtherDate: (dateOrTimestamp) =>
      format(dateOrTimestamp, DAYJS_EVENT_WEEK_DAY_FORMAT),
    formatTomorrow: (dateOrTimestamp) =>
      format(dateOrTimestamp, DAYJS_EVENT_WEEK_DAY_FORMAT),
  });
};

export const getDateHoursAndMinutes = (
  dateOrTimestamp: Date | number
): string => format(dateOrTimestamp, DATEFNS_INPUT_TIME_FORMAT);

export const currentMilliseconds = () => new Date().getTime();
