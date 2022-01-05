import { useMemo } from "react";

import { SparkleSelector } from "types/SparkleSelector";
import { AnyVenue, WorldExperience } from "types/venues";

import { withId } from "utils/id";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

const currentVenueNGSelector: SparkleSelector<AnyVenue | undefined> = (state) =>
  state.firestore.data.currentVenueNG;

const currentVenueEventsNGSelector: SparkleSelector<
  Record<string, WorldExperience> | undefined
> = (state) => state.firestore.data.currentVenueEventsNG;

export const useConnectCurrentVenueNG = (venueId?: string) => {
  useFirestoreConnect(() => {
    if (!venueId) return [];

    return [
      {
        collection: "venues",
        doc: venueId,
        storeAs: "currentVenueNG",
      },
      {
        collection: "venues",
        doc: venueId,
        subcollections: [{ collection: "events" }],
        orderBy: ["start_utc_seconds", "asc"],
        storeAs: "currentVenueEventsNG",
      },
    ];
  });

  const currentVenueNG = useSelector(currentVenueNGSelector);
  const currentVenueEventsNG = useSelector(currentVenueEventsNGSelector);
  return useMemo(
    () => ({
      currentVenue:
        venueId && currentVenueNG ? withId(currentVenueNG, venueId) : undefined,
      currentVenueEvents: currentVenueEventsNG,
      isCurrentVenueLoaded: isLoaded(currentVenueNG),
      isCurrentVenueEventsLoaded: isLoaded(currentVenueEventsNG),
    }),
    [venueId, currentVenueNG, currentVenueEventsNG]
  );
};
