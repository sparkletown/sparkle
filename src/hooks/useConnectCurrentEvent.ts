import { useParams } from "react-router-dom";
import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";
import { oneHourAfterTimestamp } from "utils/time";
import { useState } from "react";
import { useUser } from "./useUser";

export const useConnectCurrentEvent = () => {
  const { venueId } = useParams();
  const { user } = useUser();
  const [currentTimestamp] = useState(Date.now() / 1000);

  useSparkleFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events" }],
      where: [
        ["start_utc_seconds", "<=", oneHourAfterTimestamp(currentTimestamp)],
      ],
      orderBy: ["start_utc_seconds", "desc"],
      limit: 1,
      storeAs: "currentEvent",
    },
  ]);

  useSparkleFirestoreConnect([
    {
      collection: "purchases",
      where: [
        ["userId", "==", user?.uid ?? ""],
        ["venueId", "==", venueId],
        ["status", "==", "COMPLETE"],
      ],
      storeAs: "eventPurchase",
    },
  ]);
};

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentEvent;
