import { useMemo } from "react";

import { World } from "api/admin";

import { WithId, withId } from "utils/id";
import { worldEditSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

type UseWorldEditResult = {
  world?: WithId<World>;
  isLoaded: boolean;
};

export const useWorldEdit: (worldId?: string) => UseWorldEditResult = (
  worldId
) => {
  useFirestoreConnect(() => {
    if (!worldId) return [];

    return [
      {
        collection: "worlds",
        doc: worldId,
        storeAs: "worldEdit",
      },
    ];
  });

  // NOTE: world could be past instance (previous valid worldId), always check the id
  const world = useSelector(worldEditSelector);

  return useMemo(
    () =>
      worldId
        ? {
            world: world ? withId(world, worldId) : undefined,
            isLoaded: isLoaded(world),
          }
        : { world: undefined, isLoaded: true, dirty: undefined },
    [worldId, world]
  );
};
