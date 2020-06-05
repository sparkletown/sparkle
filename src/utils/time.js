import { format } from "date-fns";

const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

export const getTimeBeforeParty = (startUtcSeconds) => {
  const secondsBeforeParty = startUtcSeconds - Date.now() / 1000;
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
