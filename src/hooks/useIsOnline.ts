import { useMemo } from "react";

import { isTruthyFilter } from "utils/filter";

import { useWorldUserLocation } from "./users";

export const useIsOnline = (userId?: string) => {
  const { userLocation } = useWorldUserLocation(userId);
  const lastSeenIn = userLocation?.lastVenueIdSeenIn;

  return useMemo(
    () => ({
      isOnline: !isTruthyFilter(lastSeenIn),
      lastSeenIn,
    }),
    [lastSeenIn]
  );
};
