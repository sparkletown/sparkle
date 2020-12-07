import { useState } from "react";

import { LOC_UPDATE_FREQ_MS } from "settings";
import { getHoursAgoInSeconds } from "utils/time";
import { useInterval } from "./useInterval";

const calcDefaultThreshold = () => getHoursAgoInSeconds(3);

export const useUserLastSeenThreshold = (
  calcThreshold = calcDefaultThreshold
) => {
  const [threshold, setThreshold] = useState(calcThreshold());

  useInterval(() => {
    setThreshold(calcThreshold());
  }, LOC_UPDATE_FREQ_MS);

  return threshold;
};
