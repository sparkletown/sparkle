import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { TableSeatedUser } from "types/User";

import { convertToFirestoreKey } from "utils/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

export const useSeatedTableUsers = (spaceId: string | undefined) => {
  const {
    data: seatedTableUsers,
    isLoaded,
  } = useLiveCollection<TableSeatedUser>([
    COLLECTION_SPACES,
    convertToFirestoreKey(spaceId),
    "seatedTableUsers",
  ]);

  return [seatedTableUsers ?? ALWAYS_EMPTY_ARRAY, isLoaded];
};
