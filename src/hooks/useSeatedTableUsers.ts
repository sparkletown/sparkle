import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES } from "settings";

import { TableSeatedUser } from "types/User";

import { convertToFirestoreKey } from "utils/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

export const useSeatedTableUsers = (spaceId: string | undefined) => {
  const result = useLiveCollection<TableSeatedUser>([
    COLLECTION_SPACES,
    convertToFirestoreKey(spaceId),
    "seatedTableUsers",
  ]);

  return useMemo(
    () => ({
      ...result,
      seatedTableUsers: result.data ?? ALWAYS_EMPTY_ARRAY,
    }),
    [result]
  );
};
