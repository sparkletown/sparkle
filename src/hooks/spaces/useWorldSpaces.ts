import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export const useWorldSpaces = (worldId: string = ""): WithId<AnyVenue>[] => {
  const firestore = useFirestore();
  const worldSpacesRef = query(
    collection(firestore, COLLECTION_SPACES),
    where("worldId", "==", worldId)
  ).withConverter(withIdConverter<AnyVenue>());

  const { data: worldSpaces } = useFirestoreCollectionData<WithId<AnyVenue>>(
    worldSpacesRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  return worldSpaces;
};
