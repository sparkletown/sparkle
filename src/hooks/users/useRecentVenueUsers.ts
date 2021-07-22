import { User } from "types/User";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";

import { useRecentLocationUsers } from "hooks/users";

export interface UseRecentVenueUsersProps {
  venueName?: string;
}

export interface RecentVenueUsersData {
  recentVenueUsers: readonly WithId<User>[];
  isRecentVenueUsersLoaded: boolean;
}

// @debt refactor this to use venueId as soon as we refactor location tracking to use venueId instead of venueName
export const useRecentVenueUsers: ReactHook<
  UseRecentVenueUsersProps,
  RecentVenueUsersData
> = ({ venueName }) => {
  const {
    recentLocationUsers,
    isRecentLocationUsersLoaded,
  } = useRecentLocationUsers(venueName);

  return {
    recentVenueUsers: recentLocationUsers,
    isRecentVenueUsersLoaded: isRecentLocationUsersLoaded,
  };
};
