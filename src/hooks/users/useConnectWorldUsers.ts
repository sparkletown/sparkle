import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useVenueId } from "hooks/useVenueId";

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { sovereignVenueId, isSovereignVenueLoading } = useSovereignVenue({
    venueId,
  });

  useFirestoreConnect(() => {
    if (isSovereignVenueLoading || !sovereignVenueId || !venueId) return [];

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
