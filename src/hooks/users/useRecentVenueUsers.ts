import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useVenueId } from "hooks/useVenueId";

import { useRecentLocationUsers } from "./useRecentLocationUsers";

export const useRecentVenueUsers = () => {
  const venueId = useVenueId();

  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  const {
    recentLocationUsers,
    isRecentLocationUsersLoaded,
  } = useRecentLocationUsers(currentVenue?.name);

  return {
    recentVenueUsers: recentLocationUsers,
    isRecentVenueUsersLoaded: isRecentLocationUsersLoaded,
  };
};
