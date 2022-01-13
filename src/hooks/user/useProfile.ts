import { useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc } from "firebase/firestore";

import { COLLECTION_USERS } from "settings";

import { RefiAuthUser, RefiError, RefiStatus } from "types/reactfire";
import { Profile, User, UserLocation, UserWithLocation } from "types/User";

import { identityConverter } from "utils/converters";
import { convertToFirestoreKey, WithId, withId } from "utils/id";
import { extractLocationFromUser, omitLocationFromUser } from "utils/user";

type UseProfile = (options: { user?: RefiAuthUser }) => {
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: WithId<User>;
  isTester: boolean;
  isLoading: boolean;
  status: RefiStatus;
  error: RefiError;
};

export const useProfile: UseProfile = ({ user }) => {
  const userId = user?.uid;
  const firestore = useFirestore();

  const {
    status,
    data: profileDataWithLocation,
    error,
  } = useFirestoreDocData(
    doc(
      firestore,
      COLLECTION_USERS,
      convertToFirestoreKey(userId)
      // userId! // eslint-disable-line @typescript-eslint/no-non-null-assertion
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

  const userWithId = useMemo(() => {
    if (!userId || !user || !profile) return;

    const profileData = {
      ...profile,
      partyName: profile.partyName ?? user.displayName ?? "",
      pictureUrl: profile.pictureUrl ?? user.photoURL ?? "",
    };

    return withId(profileData, userId);
  }, [user, userId, profile]);

  const isTester = useMemo(() => !!profile?.tester, [profile?.tester]);
  const isLoading = "loading" === status;

  return useMemo(
    () => ({
      user,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
      isLoading,
      status,
      error,
    }),
    [
      user,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
      isLoading,
      status,
      error,
    ]
  );
};
