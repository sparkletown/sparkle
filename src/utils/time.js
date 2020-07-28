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

export const getTimeBeforeParty = (startUtcSeconds) => {
  const secondsBeforeParty = startUtcSeconds - Date.now() / 1000;
  if (secondsBeforeParty < 0) {
    return 0;
  }
  const numberOfCompleteDaysBeforeParty = Math.floor(
    secondsBeforeParty / ONE_DAY_IN_SECONDS
  );

  const numberOfCompleteHours = Math.floor(
    (secondsBeforeParty %
      (numberOfCompleteDaysBeforeParty * ONE_DAY_IN_SECONDS)) /
      ONE_HOUR_IN_SECONDS
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

export function formatUtcSeconds(utcSeconds) {
  return format(new Date(utcSeconds * 1000), "p");
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
