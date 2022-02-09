import { useMemo } from "react";

import { COLLECTION_USERS } from "settings";

import { FireAuthUser, LoadStatus } from "types/fire";
import { UserId, UserWithId } from "types/id";
import { Profile, UserLocation, UserWithLocation } from "types/User";

import { useFireDocument } from "hooks/fire/useFireDocument";
import { useUserId } from "hooks/user/useUserId";

type UseUserResult = LoadStatus & {
  auth?: FireAuthUser;
  user?: FireAuthUser;
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: UserWithId;
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

  const {
    error: profileError,
    isLoading: profileLoading,
    isLoaded: profileLoaded,
    data: profile,
  } = useFireDocument<UserWithLocation>(
    useMemo(() => [COLLECTION_USERS, userId], [userId])
  );

  const isTester: boolean = !!profile?.tester;
  const isLoading: boolean = authLoading || profileLoading;
  const isLoaded: boolean = authLoaded && profileLoaded;

  return useMemo(
    () => ({
      auth,
      profile,
      userId,
      isTester,
      isLoading,
      isLoaded,
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
      authError,
      profileError,
    ]
  );
};
