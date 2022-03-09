import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { SpaceId, SpaceWithId, SpaceWithoutId, WorldId } from "types/id";

import { withIdConverter } from "utils/converters";

type UseWorldSpaces = (options: {
  worldId: WorldId;
}) => { spaces: SpaceWithId[] };

export const useWorldSpaces: UseWorldSpaces = ({ worldId }) => {
  const firestore = useFirestore();
  const worldSpacesRef = query(
    collection(firestore, COLLECTION_SPACES),
    where("worldId", "==", worldId)
  ).withConverter(withIdConverter<SpaceWithoutId, SpaceId>());

  const { data: worldSpaces } = useFirestoreCollectionData<SpaceWithId>(
    worldSpacesRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  return { spaces: worldSpaces };
};
