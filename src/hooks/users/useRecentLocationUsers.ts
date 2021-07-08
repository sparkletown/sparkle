import { useMemo } from "react";

import { normalizeTimestampToMilliseconds } from "utils/time";

import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

import { useWorldUsers } from "./useWorldUsers";

/**
 * @description this hook's filtering world users based on their @lastSeenIn location
 *
 * @param locationName is a key for `lastSeenIn` firestore field in user's object
 *
 * @example useRecentLocationUsers(venue.name)
 * @example useRecentLocationUsers(`${venue.name}/${roomTitle}`)
 */
export const useRecentLocationUsers = (locationName?: string) => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  return useMemo(
    () => ({
      recentLocationUsers: locationName
        ? worldUsers.filter(
            (user) =>
              user.lastSeenIn?.[locationName] &&
              normalizeTimestampToMilliseconds(user.lastSeenIn[locationName]) >
                lastSeenThreshold
          )
        : [],
      isRecentLocationUsersLoaded: isWorldUsersLoaded,
    }),
    [worldUsers, isWorldUsersLoaded, lastSeenThreshold, locationName]
  );
};
