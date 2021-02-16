import { parentVenueSelector } from "utils/selectors";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";
import { useVenueId } from "./useVenueId";

export const useIsUserVenueOwner = (): boolean => {
  const { user } = useUser();

  const currentVenueId = useVenueId();
  const { currentVenue } = useConnectCurrentVenueNG(currentVenueId);
  const parentVenue = useSelector(parentVenueSelector);

  if (!currentVenue || !user) return false;

  const venueOwners = parentVenue ? parentVenue.owners : currentVenue.owners;

  return venueOwners.includes(user.uid);
};
