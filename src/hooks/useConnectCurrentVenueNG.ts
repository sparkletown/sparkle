import { useMemo } from "react";
import { orderBy, where } from "firebase/firestore";

import {
  COLLECTION_SPACES,
  COLLECTION_WORLD_EVENTS,
  FIELD_WORLD_ID,
} from "settings";

import { WorldAndSpaceIdLocation, WorldEventWithId } from "types/id";
import { AnyVenue } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";
import { useRefiDocument } from "hooks/fire/useRefiDocument";

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
  } = useRefiDocument<AnyVenue>([COLLECTION_SPACES, spaceKey]);

  const {
    data: currentVenueEvents,
    isLoaded: isCurrentVenueEventsLoaded,
  } = useRefiCollection<WorldEventWithId>({
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
