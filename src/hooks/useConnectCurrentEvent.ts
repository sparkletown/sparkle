import { useState } from "react";

import { oneHourAfterTimestamp } from "utils/time";

import { useFirestoreConnect } from "./useFirestoreConnect";
import { useUser } from "./useUser";
import { useVenueId } from "./useVenueId";

export const useConnectCurrentEvent = () => {
  const venueId = useVenueId();
  const { user } = useUser();
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

  useFirestoreConnect(
    venueId
      ? [
          {
            collection: "purchases",
            where: [
              ["userId", "==", user?.uid ?? ""],
              ["venueId", "==", venueId],
              ["status", "==", "COMPLETE"],
            ],
            storeAs: "eventPurchase",
          },
        ]
      : undefined
  );
};

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentEvent;
