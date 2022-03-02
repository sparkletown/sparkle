import { useMemo } from "react";
import { orderBy, where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SPACES,
  COLLECTION_WORLD_EVENTS,
  FIELD_WORLD_ID,
} from "settings";

import { WorldAndSpaceIdLocation, WorldEventWithId } from "types/id";
import { AnyVenue } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useLiveCollection } from "./fire/useLiveCollection";
import { useLiveDocument } from "./fire/useLiveDocument";

type UseConnectCurrentVenueNG = ({
  worldId,
  spaceId,
}: Partial<WorldAndSpaceIdLocation>) => {
  isCurrentVenueEventsLoaded: boolean;
  isCurrentVenueLoaded: boolean;
  currentVenueEvents: WorldEventWithId[];
  currentVenue?: WithId<AnyVenue>;
};
export const useConnectCurrentVenueNG: UseConnectCurrentVenueNG = ({
  worldId,
  spaceId,
}) => {
  const spaceKey = convertToFirestoreKey(spaceId);

  const {
    data: space,
    isLoaded: isCurrentVenueLoaded,
  } = useLiveDocument<AnyVenue>([COLLECTION_SPACES, spaceKey]);

  const {
    data: currentVenueEvents,
    isLoaded: isCurrentVenueEventsLoaded,
  } = useLiveCollection<WorldEventWithId>({
    path: [COLLECTION_WORLD_EVENTS],
    constraints: [
      where(FIELD_WORLD_ID, "==", convertToFirestoreKey(worldId)),
      where(FIELD_WORLD_ID, "==", convertToFirestoreKey(spaceId)),
      orderBy("startUtcSeconds", "asc"),
    ],
  });

  const currentVenue = spaceId ? space ?? undefined : undefined;

  return useMemo(
    () => ({
      currentVenue,
      isCurrentVenueLoaded,
      currentVenueEvents: currentVenueEvents ?? ALWAYS_EMPTY_ARRAY,
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
