import { useMemo } from "react";

import { COLLECTION_WORLDS, DEFERRED } from "settings";

import { LoadStatus } from "types/fire";
import { WorldId, WorldWithId } from "types/id";

import { useFireDocument } from "hooks/fire/useFireDocument";

type UseWorldById = (options: {
  worldId: string | undefined;
}) => LoadStatus & {
  error?: Error;
  world?: WorldWithId;
  worldId?: WorldId;
};

export const useWorldById: UseWorldById = ({ worldId }) => {
  const {
    data: world,
    isLoaded,
    isLoading,
    error,
  } = useFireDocument<WorldWithId>(
    useMemo(() => (worldId ? [COLLECTION_WORLDS, worldId] : DEFERRED), [
      worldId,
    ])
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
