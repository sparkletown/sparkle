import { useParams } from "react-router-dom";
import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";

import { currentVenueSelector } from "utils/selectors";
import getQueryParameters from "utils/getQueryParameters";

import { useSelector } from "./useSelector";

/**
 * @deprecated use useConnectCurrentVenueNG instead
 * @see useConnectCurrentVenueNG
 */
export const useConnectCurrentVenue = () => {
  let { venueId } = useParams();
  if (!venueId) {
    venueId = getQueryParameters(window.location.search)?.venueId;
  }

  useSparkleFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      storeAs: "currentVenue",
    },
  ]);

  useSparkleFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "venueEvents",
    },
  ]);

  return useSelector(currentVenueSelector);
};

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentVenue;
