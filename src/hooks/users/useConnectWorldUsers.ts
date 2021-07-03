import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSovereignVenueId } from "hooks/useSovereignVenueId";
import { useVenueId } from "hooks/useVenueId";

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { sovereignVenueId, isSovereignVenueIdLoading } = useSovereignVenueId({
    venueId,
  });

  useFirestoreConnect(() => {
    if (isSovereignVenueIdLoading || !sovereignVenueId || !venueId) return [];

    const relatedLocationIds = [venueId];

    if (sovereignVenueId) {
      relatedLocationIds.push(sovereignVenueId);
    }

    return [
      {
        collection: "users",
        where: ["enteredVenueIds", "array-contains-any", relatedLocationIds],
        storeAs: "worldUsers",
      },
    ];
  });
};
