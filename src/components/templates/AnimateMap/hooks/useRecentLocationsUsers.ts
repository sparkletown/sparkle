import { skipToken } from "@reduxjs/toolkit/dist/query/react";

import { useWorldUsersQueryState } from "store/api";

import { User, UserLocation } from "types/User";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { wrapIntoSlashes } from "utils/string";

import { useWorldUsersContext } from "hooks/users/useWorldUsers";

export interface RecentLocationsUsersData {
  isSuccess: boolean;
  name: string;
  id: string;
  users: readonly WithId<User>[];
}

export const useRecentLocationsUsers = (
  venues: WithId<AnyVenue>[]
): Array<RecentLocationsUsersData> => {
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
        const venueId = venue.id;
        const venueName = venue.name;

        locations.push({
          isSuccess: isSuccess,
          name: venueName,
          id: venueId,
          users: worldUsers.filter((user) => {
            const userLocation: WithId<UserLocation> | undefined =
              worldUserLocationsById[user.id];

            return userLocation?.lastVenueIdSeenIn?.includes(
              wrapIntoSlashes(venueId)
            );
          }),
        });
      }

      return locations;
    },
  });
};
