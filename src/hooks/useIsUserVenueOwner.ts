import { useRelatedVenues } from "./useRelatedVenues";
import { useUser } from "./useUser";
import { useVenueId } from "./useVenueId";

export const useIsUserVenueOwner = (): boolean => {
  const { user } = useUser();

  const currentVenueId = useVenueId();
  const { currentVenue, parentVenue } = useRelatedVenues({ currentVenueId });

  if (!currentVenue || !user) return false;

  const venueOwners = parentVenue ? parentVenue.owners : currentVenue.owners;

  return venueOwners.includes(user.uid);
};
