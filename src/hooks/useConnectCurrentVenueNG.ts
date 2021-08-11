import { useMemo } from "react";

import { SparkleSelector } from "types/SparkleSelector";
import { AnyVenue, VenueEvent } from "types/venues";

import { withId } from "utils/id";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

export const currentVenueNGSelector: SparkleSelector<AnyVenue | undefined> = (
  state
) => state.firestore.data.currentVenueNG;

export const currentVenueEventsNGSelector: SparkleSelector<
  Record<string, VenueEvent> | undefined
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
