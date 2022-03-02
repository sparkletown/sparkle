import { useMemo } from "react";

import { COLLECTION_USERS } from "settings";

import { LoadStatus } from "types/fire";
import { UserId, UserWithId } from "types/id";

import { convertToFirestoreKey } from "utils/id";

import { useLiveDocument } from "hooks/fire/useLiveDocument";

type UseProfileById = (options: {
  userId: UserId;
}) => LoadStatus & {
  profile?: UserWithId;
  userId?: UserId;
};

export const useProfileById: UseProfileById = ({ userId }) => {
  const {
    data: profile,
    error,
    isLoading,
    isLoaded,
  } = useLiveDocument<UserWithId>([
    COLLECTION_USERS,
    convertToFirestoreKey(userId),
  ]);

  const isTester = useMemo(() => !!profile?.tester, [profile?.tester]);

  return useMemo(
    () => ({
      profile,
      userId,
      isTester,
      isLoading,
      isLoaded,
      error,
    }),
    [profile, userId, isTester, isLoading, isLoaded, error]
  );
};
