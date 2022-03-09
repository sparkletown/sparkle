import { useMemo, useState } from "react";
import { limit, orderBy, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLD_EVENTS } from "settings";

import { WorldAndSpaceIdLocation } from "types/id";
import { WorldEvent } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";
import { oneHourAfterTimestamp } from "utils/time";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

type UseConnectCurrentEvent = ({
  worldId,
  spaceId,
}: Partial<WorldAndSpaceIdLocation>) => {
  currentEvent: WithId<WorldEvent>[];
  isLoaded: boolean;
};

export const useConnectCurrentEvent: UseConnectCurrentEvent = ({
  worldId,
  spaceId,
}) => {
  const [currentTimestamp] = useState(Date.now() / 1000);

  const { data, isLoaded } = useRefiCollection<WorldEvent>({
    path: [COLLECTION_WORLD_EVENTS],
    constraints: [
      where("startUtcSeconds", "<=", oneHourAfterTimestamp(currentTimestamp)),
      where("worldId", "==", convertToFirestoreKey(worldId)),
      where("spaceId", "==", convertToFirestoreKey(spaceId)),
      orderBy("startUtcSeconds", "desc"),
      limit(1),
    ],
  });

  return useMemo(
    () => ({
      currentEvent: data ?? ALWAYS_EMPTY_ARRAY,
      isLoaded,
    }),
    [data, isLoaded]
  );
};
