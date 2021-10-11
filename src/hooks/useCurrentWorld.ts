import { useMemo } from "react";
import { isEqual } from "lodash";

import { World } from "api/admin";

import { ReactHook } from "types/utility";

import { WithId, withId } from "utils/id";
import { currentWorldSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

interface UseCurrentWorldProps {
  worldId?: string;
}

interface UseCurrentWorldReturn {
  isLoaded: boolean;
  world?: WithId<World>;
}

export const useCurrentWorld: ReactHook<
  UseCurrentWorldProps,
  UseCurrentWorldReturn
> = ({ worldId }) => {
  const world = useSelector(currentWorldSelector, isEqual);

  useFirestoreConnect(() => {
    if (!worldId) return [];

    return [
      {
        collection: "worlds",
        doc: worldId,
        storeAs: "currentWorld",
      },
    ];
  });

  return useMemo(
    () => ({
      world: worldId && world ? withId(world, worldId) : undefined,
      isLoaded: isLoaded(world),
    }),
    [worldId, world]
  );
};
