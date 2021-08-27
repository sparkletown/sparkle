import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api";

import { User, UserLocation } from "types/User";

import { WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { useWorldUsersContext } from "hooks/users/useWorldUsers";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

export interface RecentLocationsUsersData {
  isSuccess: boolean;
  name: string;
  users: readonly WithId<User>[];
}

export const useRecentLocationsUsers = (
  locationsName?: Array<string | null>
): Array<RecentLocationsUsersData> => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  const { worldUsersApiArgs } = useWorldUsersContext();

  return useWorldUsersQueryState(worldUsersApiArgs ?? skipToken, {
    selectFromResult: ({
      isSuccess,
      data: { worldUsers, worldUserLocationsById } = {},
    }) => {
      if (!worldUsers || !worldUserLocationsById || !locationsName) return [];

      const locations = [];

      for (let i = 0; i < locationsName.length; i++) {
        const locationName = locationsName[i];

        if (!locationName) continue;

        locations.push({
          isSuccess: isSuccess,
          name: locationName,
          users: worldUsers.filter((user) => {
            const userLocation: WithId<UserLocation> | undefined =
              worldUserLocationsById[user.id];

            return (
              userLocation.lastSeenIn?.[locationName] &&
              normalizeTimestampToMilliseconds(
                userLocation.lastSeenIn[locationName]
              ) > lastSeenThreshold
            );
          }),
        });
      }

      return locations;
    },
  });
};
