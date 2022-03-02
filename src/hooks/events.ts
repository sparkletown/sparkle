import { useMemo } from "react";
import { where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED, PATH } from "settings";

import { LoadStatus } from "types/fire";
import { WorldId } from "types/id";
import { WorldEvent } from "types/venues";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type UseWorldEvents = (options: {
  worldId?: WorldId | string;
}) => LoadStatus & {
  events: WorldEvent[];
};

export const useWorldEvents: UseWorldEvents = ({ worldId }) => {
  const { data, ...loadStatus } = useLiveCollection<WorldEvent>({
    path: PATH.worldEvents,
    constraints: worldId ? [where("worldId", "==", worldId)] : DEFERRED,
  });

  return useMemo(
    () =>
      worldId
        ? {
            ...loadStatus,
            events: data ?? ALWAYS_EMPTY_ARRAY,
          }
        : {
            isLoaded: true,
            isLoading: false,
            events: ALWAYS_EMPTY_ARRAY,
          },
    [worldId, data, loadStatus]
  );
};

type UseSpaceEvents = (options: {
  worldId?: WorldId | string;
  spaceIds: string[];
}) => LoadStatus & {
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
