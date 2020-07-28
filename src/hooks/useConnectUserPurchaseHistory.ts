import { useParams } from "react-router-dom";
import { useFirestoreConnect } from "react-redux-firebase";
import { useUser } from "./useUser";

const useConnectUserPurchaseHistory = () => {
  const { venueId } = useParams();
  const { user } = useUser();

  useFirestoreConnect([
    {
      collection: "purchases",
      where: [
        ["userId", "==", user?.uid],
        ["venueId", "==", venueId],
        ["status", "==", "COMPLETE"],
      ],
      storeAs: "userPurchaseHistory",
    },
  ]);
};

export default useConnectUserPurchaseHistory;
