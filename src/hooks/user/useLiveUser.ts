import { useMemo } from "react";

import { FireAuthUser, LoadStatus } from "types/fire";
import { UserId, UserWithId } from "types/id";
import { Profile, UserLocation } from "types/User";

import { useUserId } from "hooks/user/useUserId";

import { useLiveProfile } from "./useLiveProfile";

type UseUserResult = LoadStatus & {
  /** @deprecated this field is ambiguous, pick either auth or profile or userId */
  user?: FireAuthUser;
  auth?: FireAuthUser;
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: UserWithId;
  userId?: UserId;
  isTester: boolean;
  authError?: Error;
  profileError?: Error;
};

export const useLiveUser = (): UseUserResult => {
  const authResult = useUserId();
  const profileResult = useLiveProfile(authResult);
  const authError = authResult.error;
  const profileError = profileResult.error;

  const isLoaded = authResult.isLoaded && profileResult.isLoaded;
  const isLoading = authResult.isLoading || profileResult.isLoading;
  const error = authError || profileError;
  const user = authResult.auth;

  return useMemo(
    () => ({
      ...authResult,
      ...profileResult,
      user,
      error,
      isLoaded,
      isLoading,
    }),
    [authResult, profileResult, user, error, isLoaded, isLoading]
  );
};
