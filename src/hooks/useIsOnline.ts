import { useMemo } from "react";
import { isEmpty } from "lodash";

import { useWorldUserLocation } from "./users";

export const useIsOnline = (userId?: string) => {
  const { userLocation } = useWorldUserLocation(userId);
  const lastSeenIn = userLocation?.lastSeenIn;

  return useMemo(
    () => ({
      isOnline: !isEmpty(lastSeenIn),
      lastSeenIn,
    }),
    [lastSeenIn]
  );
};
