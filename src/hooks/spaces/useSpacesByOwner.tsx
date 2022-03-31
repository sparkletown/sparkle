import { useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFERRED,
  FIELD_OWNERS,
  FIELD_WORLD_ID,
  PATH,
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
  const constraints = useMemo(
    () =>
      worldId && userId
        ? [
            where(FIELD_WORLD_ID, "==", worldId),
            where(FIELD_OWNERS, "array-contains", userId),
          ]
        : DEFERRED,
    [worldId, userId]
  );

  const options = useMemo(() => ({ path: PATH.spaces, constraints }), [
    constraints,
  ]);

  const result = useLiveCollection<SpaceWithId>(options);

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
