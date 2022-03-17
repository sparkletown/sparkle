import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, QueryConstraint, where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SEATED_USERS,
  COLLECTION_WORLDS,
} from "settings";

import { SeatedUser } from "types/User";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

interface useSeatedUsersOptions {
  worldId: string;
  spaceId: string;
  additionalWhere?: QueryConstraint[];
}

export const useSeatedUsers = <T>({
  worldId,
  spaceId,
  additionalWhere = ALWAYS_EMPTY_ARRAY,
}: useSeatedUsersOptions) => {
  const firestore = useFirestore();
  const seatedUsersRef = query(
    collection(firestore, COLLECTION_WORLDS, worldId, COLLECTION_SEATED_USERS),
    where("spaceId", "==", spaceId),
    ...additionalWhere
  ).withConverter(withIdConverter<SeatedUser<T>>());

  const { data: users, status } = useFirestoreCollectionData<
    WithId<SeatedUser<T>>
  >(seatedUsersRef);

  return { users: users || [], isLoaded: status === "success" };
};
