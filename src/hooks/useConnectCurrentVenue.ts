import { currentVenueSelector } from "utils/selectors";

import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useVenueId } from "./useVenueId";

/**
 * @deprecated use useConnectCurrentVenueNG instead
 * @see useConnectCurrentVenueNG
 */
export const useConnectCurrentVenue = () => {
  const venueId = useVenueId();

  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          storeAs: "currentVenue",
        }
      : undefined
  );

  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "events" }],
          orderBy: ["start_utc_seconds", "asc"],
          storeAs: "venueEvents",
        }
      : undefined
  );

  return useSelector(currentVenueSelector);
};

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentVenue;
