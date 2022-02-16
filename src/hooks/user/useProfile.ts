import { useMemo } from "react";

import { COLLECTION_USERS } from "settings";

import { LoadStatus, RefiAuthUser, RefiStatus } from "types/fire";
import { UserId, UserWithId } from "types/id";
import { Profile, UserLocation } from "types/User";

import { convertToFirestoreKey, withId } from "utils/id";
import { extractLocationFromUser, omitLocationFromUser } from "utils/user";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

type UseProfile = (options: {
  auth?: RefiAuthUser;
}) => LoadStatus & {
  auth?: RefiAuthUser;
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: UserWithId;
  userId?: UserId;
  isTester: boolean;
  status: RefiStatus;
};

export const useProfile: UseProfile = (props) => {
  const auth = props?.auth;
  const userId = auth?.uid as UserId | undefined;

  const { status, data: profileDataWithLocation, error } = useRefiDocument([
    COLLECTION_USERS,
    convertToFirestoreKey(userId),
  ]);

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

  const userWithId = useMemo(() => {
    if (!userId || !auth || !profile) return;

    const profileData = {
      ...profile,
      partyName: profile.partyName ?? auth.displayName ?? "",
      pictureUrl: profile.pictureUrl ?? auth.photoURL ?? "",
    };

    return withId(profileData, userId);
  }, [auth, userId, profile]);

  const isTester = useMemo(() => !!profile?.tester, [profile?.tester]);
  const isLoading = "loading" === status;
  const isLoaded = !isLoading;

  return useMemo(
    () => ({
      auth,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
      isLoading,
      isLoaded,
      status,
      error,
    }),
    [
      auth,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
      isLoading,
      isLoaded,
      status,
      error,
    ]
  );
};
