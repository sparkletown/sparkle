import { useEffect, useState } from "react";
import { getHoursAgoInSeconds } from "utils/time";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const calcLastSeenLimit = () => getHoursAgoInSeconds(3);

export const useUserLastSeenLimit = () => {
  const [userLastSeenLimit, setUserLastSeenLimit] = useState(
    calcLastSeenLimit()
  );

  useEffect(() => {
    const id = setInterval(() => {
      setUserLastSeenLimit(calcLastSeenLimit());
    }, FIVE_MINUTES_MS);

    return () => clearInterval(id);
  }, []);

  return userLastSeenLimit;
};
