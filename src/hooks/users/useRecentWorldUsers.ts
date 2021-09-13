import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api/worldUsers";

import { User, UserLocation } from "types/User";

import { WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

import { useWorldUsersContext } from "./useWorldUsers";

export interface RecentWorldUsersData {
  isRecentWorldUsersLoaded: boolean;
  recentWorldUsers: readonly WithId<User>[];
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
}

// @debt the only difference between this and useRecentLocationUsers is that useRecentWorldUsers checks
//   userLocation.lastSeenAt, whereas useRecentLocationUsers checks userLocation.lastSeenIn[locationName]
//   Can we cleanly refactor them into a single hook somehow to de-duplicate the logic?
//
// @debt I believe that generally our concept of 'world' includes only those within the relatedVenues that
//   share the same sovereignVenue, yet the implementation here actually checks for any user within the entire
//    environment that has been active within the lastSeenThreshold. I think we need to filter that down more?
export const useRecentWorldUsers = (): RecentWorldUsersData => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  const { worldUsersApiArgs } = useWorldUsersContext();

  const {
    isSuccess: isRecentWorldUsersLoaded,
    worldUserLocationsById,
    recentWorldUsers,
  } = useWorldUsersQueryState(worldUsersApiArgs ?? skipToken, {
    selectFromResult: ({
      isSuccess,
      data: { worldUsers, worldUserLocationsById } = {},
    }) => {
      if (!worldUsers || !worldUserLocationsById)
        return { isSuccess, recentWorldUsers: [], worldUserLocationsById: {} };

      const recentWorldUsers = worldUsers.filter((user) => {
        const userLocation = worldUserLocationsById[user.id];
        const userLastSeenAt = normalizeTimestampToMilliseconds(
          userLocation.lastSeenAt
        );

        return userLastSeenAt > lastSeenThreshold;
      });

      return {
        isSuccess,
        worldUserLocationsById,
        recentWorldUsers,
      };
    },
  });

  return {
    isRecentWorldUsersLoaded,
    worldUserLocationsById,
    recentWorldUsers,
  };
};
