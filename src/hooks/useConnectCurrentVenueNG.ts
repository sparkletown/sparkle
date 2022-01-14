import { useMemo } from "react";
import { orderBy } from "firebase/firestore";

import { COLLECTION_SPACE_EVENTS, COLLECTION_SPACES } from "settings";

import { SparkleSelector } from "types/SparkleSelector";
import { AnyVenue, VenueEvent } from "types/venues";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";
import { useRefiDocument } from "hooks/reactfire/useRefiDocument";

export const currentVenueNGSelector: SparkleSelector<AnyVenue | undefined> = (
  state
) => state.firestore.data.currentVenueNG;

export const currentVenueEventsNGSelector: SparkleSelector<
  Record<string, VenueEvent> | undefined
> = (state) => state.firestore.data.currentVenueEventsNG;

export const useConnectCurrentVenueNG = (spaceId?: string) => {
  const spaceKey = convertToFirestoreKey(spaceId);

  const {
    data: space,
    isLoaded: isCurrentVenueLoaded,
  } = useRefiDocument<AnyVenue>([COLLECTION_SPACES, spaceKey]);

  const {
    data: currentVenueEvents,
    isLoaded: isCurrentVenueEventsLoaded,
  } = useRefiCollection<VenueEvent>({
    path: [COLLECTION_SPACES, spaceKey, COLLECTION_SPACE_EVENTS],
    constraints: [orderBy("start_utc_seconds", "asc")],
  });

  const currentVenue = spaceId ? space ?? undefined : undefined;

  return useMemo(
    () => ({
      currentVenue,
      isCurrentVenueLoaded,
      currentVenueEvents,
      isCurrentVenueEventsLoaded,
    }),
    [
      currentVenue,
      isCurrentVenueLoaded,
      currentVenueEvents,
      isCurrentVenueEventsLoaded,
    ]
  );
};
