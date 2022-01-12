import { useMemo } from "react";

import { COLLECTION_WORLD_EVENTS } from "settings";

import { SparkleSelector } from "types/SparkleSelector";
import { AnyVenue, WorldEvent } from "types/venues";

import { withId } from "utils/id";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

const currentVenueNGSelector: SparkleSelector<AnyVenue | undefined> = (state) =>
  state.firestore.data.currentVenueNG;

const currentVenueEventsNGSelector: SparkleSelector<
  Record<string, WorldEvent> | undefined
> = (state) => state.firestore.data.currentVenueEventsNG;

export const useConnectCurrentVenueNG = (
  worldId?: string,
  spaceId?: string
) => {
  useFirestoreConnect(() => {
    if (!worldId || !spaceId) return [];

    return [
      {
        collection: "venues",
        doc: spaceId,
        storeAs: "currentVenueNG",
      },
      {
        collection: COLLECTION_WORLD_EVENTS,
        where: [
          ["worldId", "==", worldId],
          ["spaceId", "==", spaceId],
        ],
        orderBy: ["startUtcSeconds", "asc"],
        storeAs: "currentVenueEventsNG",
      },
    ];
  });

  const currentVenueNG = useSelector(currentVenueNGSelector);
  const currentVenueEventsNG = useSelector(currentVenueEventsNGSelector);
  return useMemo(
    () => ({
      currentVenue:
        spaceId && currentVenueNG ? withId(currentVenueNG, spaceId) : undefined,
      currentVenueEvents: currentVenueEventsNG,
      isCurrentVenueLoaded: isLoaded(currentVenueNG),
      isCurrentVenueEventsLoaded: isLoaded(currentVenueEventsNG),
    }),
    [spaceId, currentVenueNG, currentVenueEventsNG]
  );
};
