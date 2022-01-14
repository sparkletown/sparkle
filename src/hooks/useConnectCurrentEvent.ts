import { useMemo, useState } from "react";
import { limit, orderBy, where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SPACE_EVENTS,
  COLLECTION_SPACES,
} from "settings";

import { VenueEvent } from "types/venues";

import { convertToFirestoreKey } from "utils/id";
import { oneHourAfterTimestamp } from "utils/time";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";

import { useSpaceParams } from "./spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "./spaces/useWorldAndSpaceBySlug";

export const useConnectCurrentEvent = () => {
  const [currentTimestamp] = useState(Date.now() / 1000);
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const { data, isLoaded } = useRefiCollection<VenueEvent>({
    path: [
      COLLECTION_SPACES,
      convertToFirestoreKey(spaceId),
      COLLECTION_SPACE_EVENTS,
    ],
    constraints: [
      where("start_utc_seconds", "<=", oneHourAfterTimestamp(currentTimestamp)),
      orderBy("start_utc_seconds", "desc"),
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

/**
 * @deprecated use named export instead
 */
export default useConnectCurrentEvent;
