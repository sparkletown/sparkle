import { useState } from "react";
import { getHoursAgoInSeconds } from "utils/time";
import { useInterval } from "./useInterval";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const calcDefaultThreshold = () => getHoursAgoInSeconds(3);

export const useUserLastSeenThreshold = (
  calcThreshold = calcDefaultThreshold
) => {
  const [threshold, setThreshold] = useState(calcThreshold());

  useInterval(() => {
    setThreshold(calcThreshold());
  }, FIVE_MINUTES_MS);

  return threshold;
};
