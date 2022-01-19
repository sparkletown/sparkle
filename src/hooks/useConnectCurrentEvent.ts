import { useState } from "react";

import { COLLECTION_WORLD_EVENTS } from "settings";

import { oneHourAfterTimestamp } from "utils/time";

import { useFirestoreConnect } from "./useFirestoreConnect";

export const useConnectCurrentEvent = (worldId?: string, spaceId?: string) => {
  const [currentTimestamp] = useState(Date.now() / 1000);

  useFirestoreConnect(
    worldId && spaceId
      ? {
          collection: COLLECTION_WORLD_EVENTS,
          where: [
            ["startUtcSeconds", "<=", oneHourAfterTimestamp(currentTimestamp)],
            ["worldId", "==", worldId],
            ["spaceId", "==", spaceId],
          ],
          orderBy: ["startUtcSeconds", "desc"],
          limit: 1,
          storeAs: "currentEvent",
        }
      : undefined
  );
};

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentEvent;
