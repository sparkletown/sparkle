import { User } from "types/User";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";

import { useRecentLocationUsers } from "hooks/users";

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
    recentLocationUsers,
    isRecentLocationUsersLoaded,
  } = useRecentLocationUsers({ venueId });

  return {
    recentVenueUsers: recentLocationUsers as readonly WithId<User>[],
    isRecentVenueUsersLoaded: isRecentLocationUsersLoaded,
  };
};
