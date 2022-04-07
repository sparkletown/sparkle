import { COLLECTION_SPACES, DEFERRED } from "settings";

import { SpaceId, SpaceWithId } from "types/id";

import { useLiveDocument } from "hooks/fire/useLiveDocument";

export const useLiveBanner = (spaceId: SpaceId) => {
  const { data } = useLiveDocument<SpaceWithId>(
    spaceId ? [COLLECTION_SPACES, spaceId] : DEFERRED
  );

  return data;
};
