import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { oneHourAfterTimestamp } from "utils/time";
import { useState } from "react";
import { useUser } from "./useUser";

const useConnectCurrentEvent = () => {
  const { venueId } = useParams();
  const { user } = useUser();
  const [currentTimestamp] = useState(Date.now() / 1000);

  useFirestoreConnect([
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

  useFirestoreConnect([
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

export default useConnectCurrentEvent;
