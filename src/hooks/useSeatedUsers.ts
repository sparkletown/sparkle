import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query } from "firebase/firestore";

import { COLLECTION_SECTIONS, COLLECTION_SPACES } from "settings";

import { SeatedUser } from "types/User";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

interface useSeatedUsersOptions {
  spaceId: string;
  sectionId: string;
}

export const useSeatedUsers = <T>({
  spaceId,
  sectionId,
}: useSeatedUsersOptions) => {
  const firestore = useFirestore();
  const seatedUsersRef = query(
    collection(
      firestore,
      COLLECTION_SPACES,
      spaceId,
      COLLECTION_SECTIONS,
      sectionId,
      "seatedSectionUsers"
    )
  ).withConverter(withIdConverter<SeatedUser<T>>());

  const { data: users, status } = useFirestoreCollectionData<
    WithId<SeatedUser<T>>
  >(seatedUsersRef);

  return { users: users || [], isLoaded: status === "success" };
};
