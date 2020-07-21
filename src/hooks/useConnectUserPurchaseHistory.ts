import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

const useConnectUserPurchaseHistory = () => {
  const { venueId } = useParams();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));

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
