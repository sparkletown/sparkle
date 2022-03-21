import { useMemo } from "react";
import { useFirestore, useFirestoreDocData, useSigninCheck } from "reactfire";
import { doc } from "firebase/firestore";

import { COLLECTION_USERS } from "settings";

import { RefiAuthUser, RefiError, RefiStatus } from "types/fire";
import { UserId, UserWithId } from "types/id";
import { Profile, UserLocation, UserWithLocation } from "types/User";

import { identityConverter } from "utils/converters";
import { convertToFirestoreKey, withId } from "utils/id";
import { extractLocationFromUser, omitLocationFromUser } from "utils/user";

export interface UseUserResult {
  user?: RefiAuthUser;
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: UserWithId;
  userId?: UserId;
  isTester: boolean;
  isLoading: boolean;
  authStatus: RefiStatus;
  authError: RefiError;
  profileStatus: RefiStatus;
  profileError: RefiError;
}

/**
 * @deprecated Use src/hooks/user/useUser.ts hook instead.
 */
export const useUser = (): UseUserResult => {
  const {
    status: authStatus,
    data: authData,
    error: authError,
  } = useSigninCheck();

  const user: RefiAuthUser | undefined = authData?.user ?? undefined;
  const userId = user?.uid as UserId;

  const firestore = useFirestore();
  const {
    status: profileStatus,
    data: profileDataWithLocation,
    error: profileError,
  } = useFirestoreDocData(
    doc(
      firestore,
      COLLECTION_USERS,
      convertToFirestoreKey(userId)
    ).withConverter<UserWithLocation>(identityConverter())
  );

  const profile: Profile | undefined = useMemo(
    () =>
      profileDataWithLocation
        ? omitLocationFromUser(profileDataWithLocation)
        : undefined,
    [profileDataWithLocation]
  );

  const userLocation = useMemo(
    () =>
      profileDataWithLocation
        ? extractLocationFromUser(profileDataWithLocation)
        : undefined,
    [profileDataWithLocation]
  );

  const userWithId = useMemo<UserWithId | undefined>(() => {
    if (!userId || !user || !profile) return;

    const profileData = {
      ...profile,
      partyName: profile.partyName ?? user.displayName ?? "",
      pictureUrl: profile.pictureUrl ?? user.photoURL ?? "",
    };

    return withId(profileData, userId);
  }, [user, userId, profile]);

  const isTester = useMemo(() => !!profile?.tester, [profile?.tester]);
  const isLoading = "loading" === authStatus || "loading" === profileStatus;

  return useMemo(
    () => ({
      user,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
      isLoading,
      authStatus,
      authError,
      profileStatus,
      profileError,
    }),
    [
      user,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
      isLoading,
      authStatus,
      authError,
      profileStatus,
      profileError,
    ]
  );
};
