import { useMemo } from "react";

import { useSelector } from "./useSelector";
import { useVenueId } from "./useVenueId";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import { useSovereignVenueId } from "./useSovereignVenueId";

export const useConnectWorldEvents = () => {
  const venueId = useVenueId();

  const { sovereignVenueId, isSovereignVenueIdLoading } = useSovereignVenueId(
    venueId
  );

  useFirestoreConnect(() => {
    if (isSovereignVenueIdLoading || !sovereignVenueId) return [];

    return [
      {
        collectionGroup: "events",
        where: [["worldId", "==", sovereignVenueId]],
        storeAs: "worldEvents",
      },
    ];
  });
};

export const useWorldEvents = () => {
  useConnectWorldEvents();

  const selectedWorldEvents = useSelector(
    (state) => state.firestore.ordered.worldEvents
  );

  return useMemo(
    () => ({
      worldEvents: selectedWorldEvents ?? [],
      isWorldEventsLoaded: isLoaded(selectedWorldEvents),
    }),
    [selectedWorldEvents]
  );
};
