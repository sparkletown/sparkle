import { useMemo } from "react";
import { isEmpty } from "lodash";
import { useWorldUserLocation } from "./users";

export const useIsOnline = (userId?: string) => {
  const { userLocation } = useWorldUserLocation(userId);
  const userLastSeenIn = userLocation?.lastSeenIn;

  return useMemo(() => !isEmpty(userLastSeenIn), [userLastSeenIn]);
};
