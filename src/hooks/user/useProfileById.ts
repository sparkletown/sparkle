import { useMemo } from "react";

import { COLLECTION_USERS } from "settings";

import { LoadStatusWithError } from "types/fire";
import { UserId, UserWithId } from "types/id";

import { convertToFirestoreKey } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

type UseProfileById = (options: {
  userId: UserId;
}) => LoadStatusWithError & {
  profile?: UserWithId;
  userId?: UserId;
};

export const useProfileById: UseProfileById = ({ userId }) => {
  const {
    status,
    data: profile,
    error,
    isLoading,
    isLoaded,
  } = useRefiDocument<UserWithId>([
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
      status,
      error,
    }),
    [profile, userId, isTester, isLoading, isLoaded, status, error]
  );
};
