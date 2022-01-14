import { useMemo } from "react";
import { orderBy, where } from "firebase/firestore";

import {
  COLLECTION_SPACES,
  COLLECTION_WORLD_EVENTS,
  FIELD_WORLD_ID,
} from "settings";

import { SpaceIdLocation } from "types/id";
import { AnyVenue, WorldEvent } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";
import { useRefiDocument } from "hooks/reactfire/useRefiDocument";

type UseConnectCurrentVenueNG = ({
  worldId,
  spaceId,
}: Partial<SpaceIdLocation>) => {
  isCurrentVenueEventsLoaded: boolean;
  isCurrentVenueLoaded: boolean;
  currentVenueEvents: WithId<WorldEvent>[];
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
  } = useRefiDocument<AnyVenue>([COLLECTION_SPACES, spaceKey]);

  const {
    data: currentVenueEvents,
    isLoaded: isCurrentVenueEventsLoaded,
  } = useRefiCollection<WorldEvent>({
    path: [COLLECTION_WORLD_EVENTS],
    constraints: [
      where(FIELD_WORLD_ID, "==", worldId),
      where(FIELD_WORLD_ID, "==", spaceId),
      orderBy("startUtcSeconds", "asc"),
    ],
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
