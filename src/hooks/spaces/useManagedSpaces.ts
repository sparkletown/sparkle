import { useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  FIELD_MANAGED_BY_ID,
  FIELD_WORLD_ID,
  PATH,
} from "settings";

import { LoadStatus } from "types/fire";
import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type UseManagedSpaces = (options: {
  worldId: WorldId;
  spaceId: SpaceId;
}) => LoadStatus & {
  managedSpaces: SpaceWithId[];
};

/**
 * Subscribes to all the spaces that are managed by the given space. e.g.
 * meeting room booths, poster pages.
 */
export const useManagedSpaces: UseManagedSpaces = ({ worldId, spaceId }) => {
  const options = useMemo(
    () => ({
      path: PATH.spaces,
      constraints: [
        where(FIELD_WORLD_ID, "==", worldId),
        where(FIELD_MANAGED_BY_ID, "==", spaceId),
      ],
    }),
    [worldId, spaceId]
  );

  const result = useLiveCollection<SpaceWithId>(options);

  return useMemo(
    () => ({
      isLoading: result.isLoading,
      isLoaded: result.isLoaded,
      error: result.error,
      managedSpaces: result.data ?? ALWAYS_EMPTY_ARRAY,
    }),
    [result]
  );
};
