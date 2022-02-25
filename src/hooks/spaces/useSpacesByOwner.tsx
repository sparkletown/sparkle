import { useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SPACES,
  DEFERRED,
  FIELD_OWNERS,
  FIELD_WORLD_ID,
} from "settings";

import { LoadStatus } from "types/fire";
import { SpaceWithId, UserId } from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type UseSpacesByOwner = (options: {
  worldId?: string;
  userId: UserId;
}) => LoadStatus & {
  ownSpaces: SpaceWithId[];
};

export const useSpacesByOwner: UseSpacesByOwner = ({ worldId, userId }) => {
  const path = useMemo(() => [COLLECTION_SPACES], []);

  const constraints = useMemo(
    () => [
      worldId ? where(FIELD_WORLD_ID, "==", worldId) : DEFERRED,
      userId ? where(FIELD_OWNERS, "array-contains", userId) : DEFERRED,
    ],
    [worldId, userId]
  );

  const result = useLiveCollection<SpaceWithId>({ path, constraints });

  return useMemo(
    () => ({
      isLoading: result.isLoading,
      isLoaded: result.isLoaded,
      error: result.error,
      ownSpaces: result.data ?? ALWAYS_EMPTY_ARRAY,
    }),
    [result]
  );
};
