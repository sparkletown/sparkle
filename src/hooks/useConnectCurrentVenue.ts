import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";

const useConnectCurrentVenue = () => {
  const { venueId } = useParams();
  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      storeAs: "currentVenue",
    },
  ]);
};

export default useConnectCurrentVenue;
