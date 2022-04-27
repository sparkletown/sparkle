import { WorldId } from "common/AnimateMapCommon";
import { where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLD_EVENTS } from "../settings";

import { AnimateMapLoadStatus } from "../AnimateMapLoadStatus";
import { WorldEvent } from "../AnimateMapVenues";

import { useRefiCollection } from "./useRefiCollection";

type UseWorldEvents = (options: {
  worldId?: WorldId | string;
}) => AnimateMapLoadStatus & {
  events: WorldEvent[];
};

export const useWorldEvents: UseWorldEvents = ({ worldId }) => {
  const { data, status } = useRefiCollection<WorldEvent>({
    path: [COLLECTION_WORLD_EVENTS],
    constraints: [where("worldId", "==", worldId || "")],
  });

  if (!worldId) {
    return {
      isLoaded: true,
      isLoading: false,
      events: ALWAYS_EMPTY_ARRAY,
    };
  }

  return {
    isLoaded: status !== "loading",
    isLoading: status === "loading",
    events: data,
  };
};

type UseSpaceEvents = (options: {
  worldId?: WorldId | string;
  spaceIds: string[];
}) => AnimateMapLoadStatus & {
  events: WorldEvent[];
};

export const useSpaceEvents: UseSpaceEvents = ({ worldId, spaceIds }) => {
  const { isLoaded, isLoading, events: worldEvents } = useWorldEvents({
    worldId,
  });

  if (!spaceIds) {
    return {
      isLoaded: true,
      isLoading: false,
      events: ALWAYS_EMPTY_ARRAY,
    };
  }

  // Filter in code as firebase only supports a maximum of 10 items in an array query
  const events = (worldEvents || ALWAYS_EMPTY_ARRAY).filter(({ spaceId }) =>
    spaceIds.includes(spaceId)
  );
  events.sort((a, b) => a.startUtcSeconds - b.startUtcSeconds);

  return {
    isLoaded,
    isLoading,
    events,
  };
};
