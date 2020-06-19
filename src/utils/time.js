import { format } from "date-fns";

const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

export const getTimeBeforeParty = (startUtcSeconds) => {
  const secondsBeforeParty = startUtcSeconds - Date.now() / 1000;
  if (secondsBeforeParty < 0) {
    return 0;
  }
  if (secondsBeforeParty > ONE_DAY_IN_SECONDS) {
    const numberOfCompleteDaysBeforeParty = Math.floor(
      secondsBeforeParty / ONE_DAY_IN_SECONDS
    );
    if (numberOfCompleteDaysBeforeParty > 1) {
      return `${Math.floor(secondsBeforeParty / ONE_DAY_IN_SECONDS)} days`;
    }
    return "1 day";
  }
  const numberOfCompleteHours = Math.floor(
    secondsBeforeParty / ONE_HOUR_IN_SECONDS
  );
  const numberOfMinutes = Math.floor(
    (secondsBeforeParty % ONE_HOUR_IN_SECONDS) / ONE_MINUTE_IN_SECONDS
  );
  if (numberOfCompleteHours >= 4) {
    return `${numberOfCompleteHours} hours`;
  }
  if (numberOfCompleteHours >= 1) {
    return `${numberOfCompleteHours} ${
      numberOfCompleteHours > 1 ? "hours" : "hour"
    } and ${numberOfMinutes} minutes`;
  }
  return `${numberOfMinutes} minutes`;
};

export function formatHour(hour, startUtcSeconds) {
  if (hour === null || hour === undefined) {
    return "(unknown)";
  }
  const utcSeconds = startUtcSeconds + hour * ONE_HOUR_IN_SECONDS;
  return formatUtcSeconds(utcSeconds);
}

export function formatUtcSeconds(utcSeconds) {
  return format(new Date(utcSeconds * 1000), "p");
}

const getEventStartingTimeInSeconds = (event, startUtcSeconds) => {
  return event.start_hour * ONE_HOUR_IN_SECONDS + startUtcSeconds;
};

const getEventEndingTimeInSeconds = (event, startUtcSeconds) => {
  return (
    (event.start_hour + event.duration_minutes / 60) * ONE_HOUR_IN_SECONDS +
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

export const eventHappeningNow = (room) => {
  return !!getCurrentEvent(room);
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
