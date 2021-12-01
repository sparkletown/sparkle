import { useSpaceBySlug } from "./spaces/useSpaceBySlug";
import { useSpaceParams } from "./spaces/useSpaceParams";
import { useRelatedVenues } from "./useRelatedVenues";
import { useUser } from "./useUser";

export const useIsUserVenueOwner = (): boolean => {
  const { user } = useUser();

  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space } = useSpaceBySlug(worldSlug, spaceSlug);
  const { currentVenue, parentVenue } = useRelatedVenues({
    currentVenueId: space?.id,
  });

  if (!currentVenue || !user) return false;

  const venueOwners = parentVenue ? parentVenue.owners : currentVenue.owners;

  return venueOwners.includes(user.uid);
};
