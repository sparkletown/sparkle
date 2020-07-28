import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useUser } from "./useUser";

const useConnectCurrentEvent = () => {
  const { venueId, eventId } = useParams();
  const { user } = useUser();

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events", doc: eventId }],
      storeAs: "currentEvent",
    },
  ]);

  useFirestoreConnect([
    {
      collection: "purchases",
      where: [
        ["eventId", "==", eventId],
        ["userId", "==", user?.uid],
        ["venueId", "==", venueId],
        ["status", "==", "COMPLETE"],
      ],
      storeAs: "eventPurchase",
    },
  ]);
};

export default useConnectCurrentEvent;
