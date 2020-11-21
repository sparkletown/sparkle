import { useMemo } from "react";

import { AnyVenue } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";
import { VenueEvent } from "types/VenueEvent";

import { useSelector } from "./useSelector";
import { useSparkleFirestoreConnect } from "./useSparkleFirestoreConnect";

export const currentVenueNGSelector: SparkleSelector<AnyVenue | undefined> = (
  state
) => state.firestore.data.currentVenueNG;

export const currentVenueEventsNGSelector: SparkleSelector<
  Record<string, VenueEvent> | undefined
> = (state) => state.firestore.data.currentVenueEventsNG;

export const useConnectCurrentVenueNG = (venueId: string | null) => {
  useSparkleFirestoreConnect(
    !!venueId
      ? [
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
        ]
      : []
  );

  const currentVenueNG = useSelector(currentVenueNGSelector);
  const currentVenueEventsNG = useSelector(currentVenueEventsNGSelector);

  return useMemo(
    () => ({
      currentVenue: currentVenueNG,
      currentVenueEvents: currentVenueEventsNG,
    }),
    [currentVenueNG, currentVenueEventsNG]
  );
};
