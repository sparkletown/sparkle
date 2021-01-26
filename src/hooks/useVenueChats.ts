import { venueChatsSelector } from "utils/selectors";

import { useConnectVenueChats } from "./useConnectVenueChats";
import { useSelector } from "./useSelector";

export const useVenueChats = (venueId?: string) => {
  useConnectVenueChats(venueId);

  return useSelector(venueChatsSelector);
};
