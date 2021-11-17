import { currentVenueSelector } from "utils/selectors";

import { useSpaceBySlug } from "./spaces/useSpaceBySlug";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useSpaceParams } from "./useVenueId";

/**
 * @deprecated use useConnectCurrentVenueNG instead
 * @see useConnectCurrentVenueNG
 */
export const useConnectCurrentVenue = () => {
  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

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
