import { useMemo } from "react";
import { where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, DEFERRED, FIELD_WORLD_ID, PATH } from "settings";

import { LoadStatus } from "types/fire";
import { MaybeWorldIdLocation, SpaceWithId } from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

type UseSpacesByOwner = (
  options: MaybeWorldIdLocation
) => LoadStatus & {
  spaces: SpaceWithId[];
};

export const useSpacesByWorldId: UseSpacesByOwner = ({ worldId }) => {
  const {
    isLoading,
    isLoaded,
    error,
    data = ALWAYS_EMPTY_ARRAY,
  } = useLiveCollection<SpaceWithId>({
    path: PATH.spaces,
    constraints: worldId ? [where(FIELD_WORLD_ID, "==", worldId)] : DEFERRED,
  });

  return useMemo(
    () => ({
      isLoading,
      isLoaded,
      error,
      spaces: data,
    }),
    [isLoading, isLoaded, error, data]
  );
};
