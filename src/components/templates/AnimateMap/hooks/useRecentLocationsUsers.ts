import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api";

import { User, UserLocation } from "types/User";
import { AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { useWorldUsersContext } from "hooks/users/useWorldUsers";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

export interface RecentLocationsUsersData {
  isSuccess: boolean;
  name: string;
  users: readonly WithId<User>[];
}

export const useRecentLocationsUsers = (
  venues: Array<AnyVenue>, events: WithVenueId<VenueEvent>[]
): Array<RecentLocationsUsersData> => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  const { worldUsersApiArgs } = useWorldUsersContext();

  console.log('useRecentLocationsUsers', events);

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
          users: worldUsers.filter((user) => {
            const userLocation: WithId<UserLocation> | undefined =
              worldUserLocationsById[user.id];

            return (
              userLocation.lastSeenIn?.[venueName] &&
              normalizeTimestampToMilliseconds(
                userLocation.lastSeenIn[venueName]
              ) > lastSeenThreshold
            );
          }),
        });
      }

      return locations;
    },
  });
};
