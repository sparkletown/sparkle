import { useEffect, useState } from "react";
import { getHoursAgoInSeconds } from "utils/time";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const calcDefaultThreshold = () => getHoursAgoInSeconds(3);

export const useUserLastSeenThreshold = (
  calcThreshold = calcDefaultThreshold
) => {
  const [threshold, setThreshold] = useState(calcThreshold());

  useEffect(() => {
    const id = setInterval(() => {
      setThreshold(calcThreshold());
    }, FIVE_MINUTES_MS);

    return () => clearInterval(id);
  }, [calcThreshold]);

  return threshold;
};
