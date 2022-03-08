import { useMemo, useState } from "react";
import { limit, orderBy, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED, PATH } from "settings";

import { WorldAndSpaceIdLocation } from "types/id";
import { WorldEvent } from "types/venues";

import { WithId } from "utils/id";
import { oneHourAfterTimestamp } from "utils/time";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

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

  const { data, isLoaded } = useLiveCollection<WorldEvent>({
    path: PATH.worldEvents,
    constraints:
      worldId && spaceId
        ? [
            where(
              "startUtcSeconds",
              "<=",
              oneHourAfterTimestamp(currentTimestamp)
            ),
            where("worldId", "==", worldId),
            where("spaceId", "==", spaceId),
            orderBy("startUtcSeconds", "desc"),
            limit(1),
          ]
        : DEFERRED,
  });

  return useMemo(
    () => ({
      currentEvent: data ?? ALWAYS_EMPTY_ARRAY,
      isLoaded,
    }),
    [data, isLoaded]
  );
};
