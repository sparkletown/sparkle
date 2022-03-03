import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { TableSeatedUser } from "types/User";

import { convertToFirestoreKey, WithId } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

export const useSeatedTableUsers = (
  spaceId: string | undefined
): [WithId<TableSeatedUser>[], boolean] => {
  const {
    data: seatedTableUsers,
    isLoaded,
  } = useRefiCollection<TableSeatedUser>([
    COLLECTION_SPACES,
    convertToFirestoreKey(spaceId),
    "seatedTableUsers",
  ]);

  return [seatedTableUsers ?? ALWAYS_EMPTY_ARRAY, isLoaded];
};
