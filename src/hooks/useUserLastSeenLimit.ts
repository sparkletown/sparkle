import { useEffect, useState } from "react";
import { getHoursAgoInSeconds } from "utils/time";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const calcDefaultLimit = () => getHoursAgoInSeconds(3);

export const useUserLastSeenLimit = (calcLastSeenLimit = calcDefaultLimit) => {
  const [userLastSeenLimit, setUserLastSeenLimit] = useState(
    calcLastSeenLimit()
  );

  useEffect(() => {
    const id = setInterval(() => {
      setUserLastSeenLimit(calcLastSeenLimit());
    }, FIVE_MINUTES_MS);

    return () => clearInterval(id);
  }, [calcLastSeenLimit]);

  return userLastSeenLimit;
};
