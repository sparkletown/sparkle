import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useVenueId } from "hooks/useVenueId";

import { useRecentLocationUsers } from "./useRecentLocationUsers";

export { useConnectWorldUsers } from "./useConnectWorldUsers";
export { useWorldUsers } from "./useWorldUsers";
export {
  useWorldUsersById,
  useWorldUsersByIdWorkaround,
} from "./useWorldUsersById";
export { useRecentWorldUsers } from "./useRecentWorldUsers";
export { useRecentLocationUsers } from "./useRecentLocationUsers";

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
