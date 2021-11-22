import { useSpaceBySlug } from "./spaces/useSpaceBySlug";
import { useRelatedVenues } from "./useRelatedVenues";
import { useSpaceParams } from "./useSpaceParams";
import { useUser } from "./useUser";

export const useIsUserVenueOwner = (): boolean => {
  const { user } = useUser();

  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const { currentVenue, parentVenue } = useRelatedVenues({
    currentVenueId: space?.id,
  });

  if (!currentVenue || !user) return false;

  const venueOwners = parentVenue ? parentVenue.owners : currentVenue.owners;

  return venueOwners.includes(user.uid);
};
