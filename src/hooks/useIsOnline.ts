import { useMemo } from "react";

import { isTruthy } from "utils/types";

import { useWorldUserLocation } from "./users";

export const useIsOnline = (userId?: string) => {
  const { userLocation } = useWorldUserLocation(userId);
  const lastSeenIn = userLocation?.lastVenueIdSeenIn;

  return useMemo(
    () => ({
      isOnline: !isTruthy(lastSeenIn),
      lastSeenIn,
    }),
    [lastSeenIn]
  );
};
