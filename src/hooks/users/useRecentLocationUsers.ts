import { User, UserLocation } from "types/User";

import { WithId } from "utils/id";
import { wrapIntoSlashes } from "utils/string";

import { useRecentWorldUsers } from "./useRecentWorldUsers";

export interface RecentLocationUsersData {
  isRecentLocationUsersLoaded: boolean;
  recentLocationUsers: readonly WithId<User>[];
}

/**
 * @description this hook's filtering world users based on their @lastSeenIn location
 *
 * @param locationName is a key for `lastSeenIn` firestore field in user's object
 *
 * @example useRecentLocationUsers(venue.name)
 * @example useRecentLocationUsers(`${venue.name}/${roomTitle}`)
 *
 * @debt the only difference between this and useRecentWorldUsers is that useRecentWorldUsers checks
 *   userLocation.lastSeenAt, whereas useRecentLocationUsers checks userLocation.lastSeenIn[locationName]
 *   Can we cleanly refactor them into a single hook somehow to de-duplicate the logic?
 */
export const useRecentLocationUsers = ({
  venueId,
}: {
  venueId?: string;
}): RecentLocationUsersData => {
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
    isRecentLocationUsersLoaded: isRecentWorldUsersLoaded,
    recentLocationUsers,
  };
};
