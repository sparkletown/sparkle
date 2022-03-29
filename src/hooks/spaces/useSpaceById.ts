import { useMemo } from "react";

import { COLLECTION_SPACES, DEFERRED } from "settings";

import { LoadStatus } from "types/fire";
import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { useFireDocument } from "hooks/fire/useFireDocument";

type UseSpaceById = (options: {
  spaceId: string | undefined;
}) => LoadStatus & {
  space?: SpaceWithId;
  spaceId?: SpaceId;
  worldId?: WorldId;
  error?: string;
};

export const useSpaceById: UseSpaceById = ({ spaceId }) => {
  const { data: space, isLoading, isLoaded } = useFireDocument<SpaceWithId>(
    useMemo(() => (spaceId ? [COLLECTION_SPACES, spaceId] : DEFERRED), [
      spaceId,
    ])
  );

  return {
    space,
    spaceId: space?.id as SpaceId | undefined,
    worldId: space?.worldId as WorldId | undefined,
    isLoaded,
    isLoading,
  };
};
