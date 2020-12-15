import { format } from "date-fns";
import { RoomData } from "types/RoomData";
import { RoomEvent } from "types/RoomEventData";
import { VenueEvent } from "types/VenueEvent";

export const ONE_MINUTE_IN_SECONDS = 60;
export const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
export const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

export const FIVE_MINUTES_MS = 5 * 60 * 1000;

const formatMeasurementInString = (value: number, measureUnit: string) => {
  const baseFormatted = `${value} ${measureUnit}`;

  if (value === 0) return "";
  if (value === 1) return baseFormatted;
  if (value > 1) return `${baseFormatted}s`;
};

// @debt quality test this
export const getTimeBeforeParty = (startUtcSeconds?: number) => {
  if (startUtcSeconds === undefined) return "???";

  const secondsBeforeParty = startUtcSeconds - Date.now() / 1000;

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
  event.start_utc_seconds - Date.now() / 1000 > ONE_HOUR_IN_SECONDS;

export function formatMinute(
  minute: number | null | undefined,
  startUtcSeconds: number
) {
  if (minute === null || minute === undefined) {
    return "(unknown)";
  }
  const utcSeconds = startUtcSeconds + minute * ONE_MINUTE_IN_SECONDS;
  return formatUtcSeconds(utcSeconds);
}

export function formatDate(utcSeconds: number) {
  return format(new Date(utcSeconds * 1000), "MMM do");
}

export function oneHourAfterTimestamp(timestamp: number) {
  return timestamp + ONE_HOUR_IN_SECONDS;
}

export function formatUtcSeconds(utcSeconds?: number | null) {
  return utcSeconds ? format(new Date(utcSeconds * 1000), "p") : "(unknown)";
}

const getEventStartingTimeInSeconds = (
  event: RoomEvent,
  startUtcSeconds: number
) => {
  return event.start_minute * ONE_MINUTE_IN_SECONDS + startUtcSeconds;
};

const getEventEndingTimeInSeconds = (
  event: RoomEvent,
  startUtcSeconds: number
) => {
  return (
    (event.start_minute + event.duration_minutes) * ONE_MINUTE_IN_SECONDS +
    startUtcSeconds
  );
};

export const getCurrentEvent = (room: RoomData, startUtcSeconds: number) => {
  const currentTimeInSeconds = Date.now() / 1000;

  return room.events.find((event) => {
    const eventStart = getEventStartingTimeInSeconds(event, startUtcSeconds);
    const eventEnd = getEventEndingTimeInSeconds(event, startUtcSeconds);

    const hasEventStarted = eventStart < currentTimeInSeconds;
    const hasEventEnded = eventEnd < currentTimeInSeconds;

    return hasEventStarted && !hasEventEnded;
  });
};

export const eventHappeningNow = (room: RoomData, startUtcSeconds: number) => {
  return !!getCurrentEvent(room, startUtcSeconds);
};

export function entranceUnhosted(
  startUtcSeconds: number,
  hostedDurationHours: number
) {
  const currentTimeInSeconds = Date.now() / 1000;
  return (
    currentTimeInSeconds >
    startUtcSeconds + hostedDurationHours * ONE_HOUR_IN_SECONDS
  );
}

export function getHoursAgoInSeconds(hours: number) {
  const nowInSec = Date.now() / 1000;
  return nowInSec - hours * 60 * 60;
}

export const getCurrentTimeInUnixEpochSeconds = () => Date.now() / 1000;

export function getDaysAgoInSeconds(days: number) {
  return getHoursAgoInSeconds(days * 24);
}

export const formatHourAndMinute = (utcSeconds: number) => {
  const date = new Date(utcSeconds * 1000);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return hh + ":" + mm;
};

export const daysFromEndOfEvent = (
  utcSeconds: number,
  durationMinutes: number
) => {
  const dateNow = new Date();
  const dateOfFinish = new Date((utcSeconds + durationMinutes * 60) * 1000);
  const differenceInTime = dateOfFinish.getTime() - dateNow.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.round(differenceInDays);
};

export const daysFromStartOfEvent = (utcSeconds: number) => {
  const dateNow = new Date();
  const dateOfStart = new Date(utcSeconds * 1000);
  const differenceInTime = dateNow.getTime() - dateOfStart.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.round(differenceInDays);
};

export const dateEventTimeFormat = (date: Date) => {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return hh + ":" + mm;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
//   The static Date.now() method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
export const getCurrentTimeInUTCSeconds = () => Date.now() / 1000;

export const roundToNearestHour = (seconds: number) => {
  const oneHour = 60 * 60;
  return Math.floor(seconds / oneHour) * oneHour;
};

export function formatDateToWeekday(utcSeconds: number) {
  return format(new Date(utcSeconds * 1000), "E");
}
