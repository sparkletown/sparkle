import { venueSelector } from "utils/selectors";

import { useSelector } from "./useSelector";
import { useUser } from "./useUser";

export const useUserIsVenueOwner = (): boolean => {
  const { user } = useUser();
  const currentVenue = useSelector(venueSelector);

  if (!currentVenue || !user) return false;

  const isVenueOwner = currentVenue.owners.includes(user.uid);

  return isVenueOwner;
};
