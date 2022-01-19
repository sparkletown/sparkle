import { COLLECTION_USERS } from "settings";

import { User } from "types/User";

import { convertToFirestoreKey } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

export const useCurrentModalUser = (userId?: string) => {
  const { data, isLoaded } = useRefiDocument<User>([
    COLLECTION_USERS,
    convertToFirestoreKey(userId),
  ]);

  return {
    user: userId ? data ?? undefined : undefined,
    isLoaded,
  };
};
