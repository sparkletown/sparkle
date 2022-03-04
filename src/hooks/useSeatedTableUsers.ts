import { useMemo } from "react";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_SPACES, DEFERRED } from "settings";

import { TableSeatedUser } from "types/User";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

export const useSeatedTableUsers = (spaceId: string | undefined) => {
  const result = useLiveCollection<TableSeatedUser>([
    COLLECTION_SPACES,
    spaceId || DEFERRED,
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
