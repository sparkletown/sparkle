import { useMemo } from "react";

import { AnimateMapFireAuthUser } from "../AnimateMapFireAuthUser";
import { UserId, UserWithId } from "../AnimateMapIds";
import { AnimateMapLoadStatus } from "../AnimateMapLoadStatus";
import { Profile, UserLocation } from "../AnimateMapUser";

import { useLiveProfile } from "./useLiveProfile";
import { useUserId } from "./useUserId";

type UseUserResult = AnimateMapLoadStatus & {
  /** @deprecated this field is ambiguous, pick either auth or profile or userId */
  user?: AnimateMapFireAuthUser;
  auth?: AnimateMapFireAuthUser;
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
