import { useParams } from "react-router-dom";
import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";
import { useUser } from "./useUser";

export const useConnectUserPurchaseHistory = () => {
  const { venueId } = useParams();
  const { user } = useUser();

  useSparkleFirestoreConnect([
    {
      collection: "purchases",
      where: [
        ["userId", "==", user?.uid ?? ""],
        ["venueId", "==", venueId],
        ["status", "==", "COMPLETE"],
      ],
      storeAs: "userPurchaseHistory",
    },
  ]);
};

/**
 * @deprecated use named export instead
 */
export default useConnectUserPurchaseHistory;
