import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { COLLECTION_SPACES, FIELD_IS_HIDDEN, FIELD_WORLD_ID } from "settings";

import { SpaceId, SpaceWithId, SpaceWithoutId, WorldId } from "types/id";

import { withIdConverter } from "utils/converters";

type UseWorldSpaces = (options: {
  worldId: WorldId | undefined;
}) => { spaces: SpaceWithId[] };

export const useWorldSpaces: UseWorldSpaces = ({ worldId }) => {
  const firestore = useFirestore();

  const worldSpacesRef = query(
    collection(firestore, COLLECTION_SPACES),
    where(FIELD_WORLD_ID, "==", worldId ?? ""),
    where(FIELD_IS_HIDDEN, "==", false)
  ).withConverter(withIdConverter<SpaceWithoutId, SpaceId>());

  const { data: worldSpaces } = useFirestoreCollectionData<SpaceWithId>(
    worldSpacesRef
  );

  return { spaces: worldSpaces };
};
