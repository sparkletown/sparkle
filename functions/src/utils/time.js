export const formatSecondsAsHHMMSS = (secondsValue) => {
  const { hours = 0, minutes = 0, seconds = 0 } = secondsToDuration(
    secondsValue
  );
  const hourFormatted = hours < 10 ? `0${hours}` : hours;
  const minuteFormatted = minutes < 10 ? `0${minutes}` : minutes;
  const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

  return `${hourFormatted}:${minuteFormatted}:${secondsFormatted}`;
};
