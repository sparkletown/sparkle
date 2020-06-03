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
