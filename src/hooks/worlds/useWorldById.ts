import { useMemo } from "react";

import { COLLECTION_WORLDS } from "settings";

import { LoadStatus } from "types/fire";
import { WorldId, WorldWithId } from "types/id";
import { ReactHook } from "types/utility";

import { useFireDocument } from "hooks/fire/useFireDocument";

type UseWorldById = ReactHook<
  string | undefined,
  LoadStatus & {
    error?: Error;
    world?: WorldWithId;
    worldId?: WorldId;
  }
>;

export const useWorldById: UseWorldById = (worldId) => {
  const {
    data: world,
    isLoaded,
    isLoading,
    error,
  } = useFireDocument<WorldWithId>(
    useMemo(() => [COLLECTION_WORLDS, worldId], [worldId])
  );

  return useMemo(
    () => ({
      world,
      worldId: world?.id,
      isLoaded,
      isLoading,
      error,
    }),
    [world, error, isLoaded, isLoading]
  );
};
