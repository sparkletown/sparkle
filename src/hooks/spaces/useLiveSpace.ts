import { COLLECTION_SPACES, DEFERRED } from "settings";

import { SpaceId, SpaceWithId } from "types/id";

import { useLiveDocument } from "hooks/fire/useLiveDocument";

export const useLiveSpace = (spaceId: SpaceId) => {
  const { data: space } = useLiveDocument<SpaceWithId>(
    spaceId ? [COLLECTION_SPACES, spaceId] : DEFERRED
  );

  return space;
};
