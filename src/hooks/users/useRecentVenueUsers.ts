import { User, UserLocation } from "types/User";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";
import { wrapIntoSlashes } from "utils/string";

import { useRecentWorldUsers } from "./useRecentWorldUsers";

export interface UseRecentVenueUsersProps {
  venueId?: string;
}

export interface RecentVenueUsersData {
  recentVenueUsers: readonly WithId<User>[];
  isRecentVenueUsersLoaded: boolean;
}

export const useRecentVenueUsers: ReactHook<
  UseRecentVenueUsersProps,
  RecentVenueUsersData
> = ({ venueId }) => {
  const {
    recentWorldUsers,
    worldUserLocationsById,
    isRecentWorldUsersLoaded,
  } = useRecentWorldUsers();

  const recentLocationUsers = recentWorldUsers.filter((user) => {
    const userLocation: WithId<UserLocation> | undefined =
      worldUserLocationsById[user.id];

    return (
      venueId &&
      userLocation?.lastVenueIdSeenIn?.includes(wrapIntoSlashes(venueId))
    );
  });

  return {
    recentVenueUsers: recentLocationUsers as readonly WithId<User>[],
    isRecentVenueUsersLoaded: isRecentWorldUsersLoaded,
  };
};
