import { useState } from "react";

import { oneHourAfterTimestamp } from "utils/time";

import { useSpaceBySlug } from "./spaces/useSpaceBySlug";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useSpaceParams } from "./useVenueId";

export const useConnectCurrentEvent = () => {
  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

  const [currentTimestamp] = useState(Date.now() / 1000);

  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "events" }],
          where: [
            [
              "start_utc_seconds",
              "<=",
              oneHourAfterTimestamp(currentTimestamp),
            ],
          ],
          orderBy: ["start_utc_seconds", "desc"],
          limit: 1,
          storeAs: "currentEvent",
        }
      : undefined
  );
};

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentEvent;
