import { format } from "date-fns";

export const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

const formatMeasurementInString = (value, measureUnit) =>
  value > 0
    ? value > 1
      ? `${value} ${measureUnit}s`
      : `1 ${measureUnit}`
    : "";

// @debt quality test this
export const getTimeBeforeParty = (startUtcSeconds) => {
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

export const canUserJoinTheEvent = (event) => {
  if (event.start_utc_seconds - Date.now() / 1000 > ONE_HOUR_IN_SECONDS) {
    return false;
  }
  return true;
};

export function formatMinute(minute, startUtcSeconds) {
  if (minute === null || minute === undefined) {
    return "(unknown)";
  }
  const utcSeconds = startUtcSeconds + minute * ONE_MINUTE_IN_SECONDS;
  return formatUtcSeconds(utcSeconds);
}

export function formatDate(utcSeconds) {
  return format(new Date(utcSeconds * 1000), "MMM do");
}

export function oneHourAfterTimestamp(timestamp) {
  return timestamp + ONE_HOUR_IN_SECONDS;
}

export function formatUtcSeconds(utcSeconds) {
  return utcSeconds ? format(new Date(utcSeconds * 1000), "p") : "(unknown)";
}

const getEventStartingTimeInSeconds = (event, startUtcSeconds) => {
  return event.start_minute * ONE_MINUTE_IN_SECONDS + startUtcSeconds;
};

const getEventEndingTimeInSeconds = (event, startUtcSeconds) => {
  return (
    (event.start_minute + event.duration_minutes) * ONE_MINUTE_IN_SECONDS +
    startUtcSeconds
  );
};

export const getCurrentEvent = (room, startUtcSeconds) => {
  const currentTimeInSeconds = new Date() / 1000;
  return room.events.find(
    (event) =>
      getEventStartingTimeInSeconds(event, startUtcSeconds) <
        currentTimeInSeconds &&
      getEventEndingTimeInSeconds(event, startUtcSeconds) > currentTimeInSeconds
  );
};

export const eventHappeningNow = (room, startUtcSeconds) => {
  return !!getCurrentEvent(room, startUtcSeconds);
};

export function entranceUnhosted(startUtcSeconds, hostedDurationHours) {
  const currentTimeInSeconds = new Date() / 1000;
  return (
    currentTimeInSeconds >
    startUtcSeconds + hostedDurationHours * ONE_HOUR_IN_SECONDS
  );
}

export function getHoursAgoInSeconds(hours) {
  return new Date().getTime() / 1000 - hours * 60 * 60;
}

export function getDaysAgoInSeconds(days) {
  return getHoursAgoInSeconds(days * 24);
}

export const formatHourAndMinute = (utcSeconds) => {
  const date = new Date(utcSeconds * 1000);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return hh + ":" + mm;
};

export const daysFromEndOfEvent = (utcSeconds, durationMinutes) => {
  const dateNow = new Date();
  const dateOfFinish = new Date((utcSeconds + durationMinutes * 60) * 1000);
  const differenceInTime = dateOfFinish.getTime() - dateNow.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.round(differenceInDays);
};

export const daysFromStartOfEvent = (utcSeconds) => {
  const dateNow = new Date();
  const dateOfStart = new Date(utcSeconds * 1000);
  const differenceInTime = dateNow.getTime() - dateOfStart.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.round(differenceInDays);
};

export const dateEventTimeFormat = (date) => {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return hh + ":" + mm;
};

export const getCurrentTimeInUTCSeconds = () => {
  const date = new Date();
  return (
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    ) / 1000
  );
};
