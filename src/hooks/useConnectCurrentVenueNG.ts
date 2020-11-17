import { useMemo } from "react";

import { WithId } from "utils/id";
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

/**
 * HACK: we should do something better than the explicit as WithId<AnyVenue> here
 * (though this should be no worse than how it was)
 *
 * @deprecated this selector only exists for the benefit of minimising the changes
 * required to upgrade from some of our older patterns till we can upgrade them
 */
export const currentVenueNGLegacyWorkaroundSelector: SparkleSelector<WithId<
  AnyVenue
>> = (state) => state.firestore.ordered.currentVenueNG?.[0] as WithId<AnyVenue>;

/**
 * HACK: we should do something better than the explicit as WithId<VenueEvent> here
 * (though this should be no worse than how it was)
 *
 * @deprecated this selector only exists for the benefit of minimising the changes
 * required to upgrade from some of our older patterns till we can upgrade them
 */
export const currentVenueEventsNGLegacyWorkaroundSelector: SparkleSelector<
  WithId<VenueEvent>[]
> = (state) =>
  state.firestore.ordered.currentVenueEventsNG as WithId<VenueEvent>[];
export const useConnectCurrentVenueNG = (venueId: string) => {
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
