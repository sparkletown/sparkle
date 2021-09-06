import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api";

import { User, UserLocation } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { useWorldUsersContext } from "hooks/users/useWorldUsers";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

export interface RecentLocationsUsersData {
  isSuccess: boolean;
  name: string;
  id: string;
  users: readonly WithId<User>[];
}

export const useRecentLocationsUsers = (
  venues: WithId<AnyVenue>[]
): Array<RecentLocationsUsersData> => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  const { worldUsersApiArgs } = useWorldUsersContext();

  return useWorldUsersQueryState(worldUsersApiArgs ?? skipToken, {
    selectFromResult: ({
      isSuccess,
      data: { worldUsers, worldUserLocationsById } = {},
    }) => {
      if (!worldUsers || !worldUserLocationsById || !venues.length) return [];

      const locations = [];

      for (let i = 0; i < venues.length; i++) {
        const venue = venues[i];
        const venueName = venue.name;

        locations.push({
          isSuccess: isSuccess,
          name: venueName,
          id: venue.id,
          users: worldUsers.filter((user) => {
            const userLocation: WithId<UserLocation> | undefined =
              worldUserLocationsById[user.id];

            return (
              userLocation.lastVenueIdSeenIn === venueName &&
              normalizeTimestampToMilliseconds(userLocation.lastSeenAt) >
                lastSeenThreshold
            );
          }),
        });
      }

      return locations;
    },
  });
};
