import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_WORLDS } from "settings";

import { LoadStatus } from "types/fire";
import { WorldId, WorldWithId } from "types/id";

import { withIdConverter } from "utils/converters";

type UseOwnWorlds = (options: {
  userId: string;
}) => LoadStatus & { ownWorlds: WorldWithId[] };

export const useOwnWorlds: UseOwnWorlds = ({ userId }) => {
  const firestore = useFirestore();

  const ownWorldsRef = query(
    collection(firestore, COLLECTION_WORLDS),
    where("isHidden", "==", false),
    where("owners", "array-contains", userId)
  ).withConverter(withIdConverter<WorldWithId, WorldId>());

  const {
    data: ownWorlds,
    status,
    error,
  } = useFirestoreCollectionData<WorldWithId>(ownWorldsRef, {
    initialData: ALWAYS_EMPTY_ARRAY,
  });

  const isLoading = status === "loading";
  const isLoaded = status === "success";

  return { ownWorlds, isLoading, isLoaded, error };
};
