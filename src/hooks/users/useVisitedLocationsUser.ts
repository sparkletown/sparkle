import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api";

import { User } from "types/User";

import { WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";
import { getUserLocationData } from "utils/user";

import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

import { useWorldUsersContext } from "./useWorldUsers";

export interface RecentLocationUsersData {
  isRecentLocationUsersLoaded: boolean;
  recentLocationUsers: readonly WithId<User>[][];
}

/**
 * @description this hook's filtering world users based on their @lastSeenIn location
 *
 * @param locationName is a key for `lastSeenIn` firestore field in user's object
 *
 * @example useVisitedLocationsUser(venue.name)
 * @example useVisitedLocationsUser(`${venue.name}/${roomTitle}`)
 *
 * @debt the only difference between this and useRecentWorldUsers is that useRecentWorldUsers checks
 *   userLocation.lastSeenAt, whereas useVisitedLocationsUser checks userLocation.lastSeenIn[locationName]
 *   Can we cleanly refactor them into a single hook somehow to de-duplicate the logic?
 */
export const useVisitedLocationsUser = ({
  portalVenueIds,
}: {
  portalVenueIds?: string[];
}): RecentLocationUsersData => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  const { worldUsersApiArgs } = useWorldUsersContext();
  const {
    isSuccess: isRecentLocationUsersLoaded,
    recentLocationUsers,
  } = useWorldUsersQueryState(worldUsersApiArgs ?? skipToken, {
    selectFromResult: ({
      isSuccess,
      data: { worldUsers, worldUserLocationsById } = {},
    }) => {
      if (!worldUsers || !worldUserLocationsById || !portalVenueIds)
        return { isSuccess, recentLocationUsers: [] };

      const recentLocationUsers = portalVenueIds?.map((portalVenueId) => {
        const result = worldUsers
          .filter((user) => {
            const { isLocationMatch, lastSeenAt } = getUserLocationData({
              worldUserLocationsById,
              user,
              portalVenueId,
            });

            return (
              isLocationMatch &&
              normalizeTimestampToMilliseconds(lastSeenAt) > lastSeenThreshold
            );
          })
          .map((user) => ({
            ...user,
            portalId: portalVenueId,
          }));
        return result;
      });

      return {
        isSuccess,
        recentLocationUsers,
      };
    },
  });

  return {
    isRecentLocationUsersLoaded,
    recentLocationUsers,
  };
};
