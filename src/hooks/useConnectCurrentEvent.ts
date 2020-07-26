import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

const useConnectCurrentEvent = () => {
  const { venueId, eventId } = useParams();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events", doc: eventId }],
      storeAs: "currentEvent",
    },
  ]);

  const { event } = useSelector((state: any) => ({
    event: state.firestore.data.currentEvent,
  }));

  useFirestoreConnect([
    {
      collection: "purchases",
      where: [
        ["eventId", "==", eventId],
        ["userId", "==", user.uid],
        ["venueId", "==", venueId],
        ["status", "==", "COMPLETE"],
      ],
      storeAs: "eventPurchase",
    },
  ]);
};

export default useConnectCurrentEvent;
