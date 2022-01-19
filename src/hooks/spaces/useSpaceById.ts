import { COLLECTION_SPACES } from "settings";

import { LoadStatus } from "types/fire";
import { SpaceId, SpaceWithId, WorldId } from "types/id";

import { convertToFirestoreKey } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

type UseSpaceById = (options: {
  spaceId?: SpaceId;
}) => LoadStatus & {
  space?: SpaceWithId;
  spaceId?: SpaceId;
  worldId?: WorldId;
  error?: string;
};

export const useSpaceById: UseSpaceById = (options) => {
  const { data: space, isLoading, isLoaded } = useRefiDocument<SpaceWithId>([
    COLLECTION_SPACES,
    convertToFirestoreKey(options?.spaceId),
  ]);

  return {
    space,
    spaceId: space?.id as SpaceId | undefined,
    worldId: space?.worldId as WorldId | undefined,
    isLoaded,
    isLoading,
  };
};
