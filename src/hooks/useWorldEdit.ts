import { useMemo } from "react";

import { World } from "api/admin";

import { WithId, withId } from "utils/id";
import { worldEditSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

type UseWorldEditResult = { world?: WithId<World>; isLoaded: boolean };

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

  const world = useSelector(worldEditSelector);

  return useMemo(
    () => ({
      world: worldId && world ? withId(world, worldId) : undefined,
      isLoaded: isLoaded(world),
    }),
    [worldId, world]
  );
};
