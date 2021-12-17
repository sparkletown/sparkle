import { useState } from "react";

import { oneHourAfterTimestamp } from "utils/time";

import { useSpaceParams } from "./spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "./spaces/useWorldAndSpaceBySlug";
import { useFirestoreConnect } from "./useFirestoreConnect";

export const useConnectCurrentEvent = () => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const [currentTimestamp] = useState(Date.now() / 1000);

  useFirestoreConnect(
    spaceId
      ? {
          collection: "venues",
          doc: spaceId,
          subcollections: [{ collection: "events" }],
          where: [
            [
              "start_utc_seconds",
              "<=",
              oneHourAfterTimestamp(currentTimestamp),
            ],
          ],
          orderBy: ["start_utc_seconds", "desc"],
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
