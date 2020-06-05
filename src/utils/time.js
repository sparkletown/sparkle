import { format } from "date-fns";
import { PARTY_START_UTC_SECONDS } from "config";

const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

export const getTimeBeforeParty = () => {
  const secondsBeforeParty = PARTY_START_UTC_SECONDS - Date.now() / 1000;
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
  if (numberOfCompleteHours >= 1) {
    return `${numberOfCompleteHours}hrs`;
  }
  return `${numberOfMinutes}mins`;
};

export function formatHour(hour) {
  if (hour === null || hour === undefined) {
    return "(unknown)";
  }
  const utcSeconds = PARTY_START_UTC_SECONDS + hour * 60 * 60;
  return formatUtcSeconds(utcSeconds);
}

export function formatUtcSeconds(utcSec) {
  return format(new Date(utcSec * 1000), "p");
}

export const getCurrentEvent = (room) => {
  const currentTimeInSeconds = new Date() / 1000;
  for (const event of room.events) {
    if (
      formatHour(event.start_hour) < currentTimeInSeconds &&
      formatHour(event.start_hour + event.duration_hours) > currentTimeInSeconds
    ) {
      return event;
    }
  }
};
