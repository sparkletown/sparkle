import { useFirestoreConnect } from "./useFirestoreConnect";
import { useUser } from "./useUser";
import { useVenueId } from "./useVenueId";

export const useConnectUserPurchaseHistory = () => {
  const venueId = useVenueId();
  const { user } = useUser();

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
            storeAs: "userPurchaseHistory",
          },
        ]
      : undefined
  );
};

/**
 * @deprecated use named export instead
 */
export default useConnectUserPurchaseHistory;
