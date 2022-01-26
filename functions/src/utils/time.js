/**
 * @deprecated in favor of using date-fns functions
 */
const ONE_MINUTE_IN_SECONDS = 60;

/**
 * @deprecated in favor of using date-fns functions
 */
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS * 60;

/**
 * @deprecated in favor of using date-fns functions
 */
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

const secondsToDuration = (totalSeconds) => {
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

const formatSecondsAsHHMMSS = (secondsValue) => {
  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = secondsToDuration(secondsValue);
  const hourFormatted = hours < 10 ? `0${hours}` : hours;
  const minuteFormatted = minutes < 10 ? `0${minutes}` : minutes;
  const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

  return `${hourFormatted}:${minuteFormatted}:${secondsFormatted}`;
};

exports.formatSecondsAsHHMMSS = formatSecondsAsHHMMSS;
