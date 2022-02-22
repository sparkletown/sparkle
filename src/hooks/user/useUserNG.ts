import { useMemo } from "react";

import { COLLECTION_USERS } from "settings";

import { FireAuthUser, LoadStatus } from "types/fire";
import { UserId } from "types/id";
import { UserWithLocation } from "types/User";

import { useFireDocument } from "hooks/fire/useFireDocument";
import { useUserId } from "hooks/user/useUserId";

type UseUserResult = LoadStatus & {
  auth?: FireAuthUser;
  profile?: UserWithLocation;
  userId?: UserId;
  isTester: boolean;
  authError?: Error;
  profileError?: Error;
};

export const useUserNG = (): UseUserResult => {
  const {
    userId,
    auth,
    isLoading: authLoading,
    isLoaded: authLoaded,
    error: authError,
  } = useUserId();

  const path = useMemo(() => [COLLECTION_USERS, userId], [userId]);

  const {
    error: profileError,
    isLoading: profileLoading,
    isLoaded: profileLoaded,
    data: profile,
  } = useFireDocument<UserWithLocation>(path);

  const isTester: boolean = !!profile?.tester;
  const isLoading: boolean = authLoading || profileLoading;
  const isLoaded: boolean = authLoaded && profileLoaded;
  const error: Error | undefined = authError || profileError;

  return useMemo(
    () => ({
      auth,
      profile,
      userId,
      isTester,
      isLoading,
      isLoaded,
      error,
      authError,
      profileError,
    }),
    [
      auth,
      profile,
      userId,
      isTester,
      isLoading,
      isLoaded,
      error,
      authError,
      profileError,
    ]
  );
};
