import { collection, getFirestore, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { SpaceId, SpaceWithId, SpaceWithoutId, WorldId } from "types/id";

import { withIdConverter } from "utils/converters";

import { useFireQuery } from "hooks/fire/useFireQuery";

type UseWorldSpaces = (options: {
  worldId: WorldId;
}) => { spaces: SpaceWithId[] };

export const useWorldSpaces: UseWorldSpaces = ({ worldId }) => {
  const { data = ALWAYS_EMPTY_ARRAY } = useFireQuery<SpaceWithId>(
    query(
      collection(getFirestore(), COLLECTION_SPACES),
      where("worldId", "==", worldId)
    ).withConverter(withIdConverter<SpaceWithoutId, SpaceId>())
  );

  return { spaces: data };
};
