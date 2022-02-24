import { useMemo } from "react";
import { omit } from "lodash/fp";

import { COLLECTION_USERS } from "settings";

import { FireAuthUser, LoadStatus, RefiAuthUser } from "types/fire";
import { UserId, UserWithId } from "types/id";
import { Profile, UserLocation, UserWithLocation } from "types/User";

import { withId } from "utils/id";
import { extractLocationFromUser, omitLocationFromUser } from "utils/user";

import { useLiveDocument } from "hooks/fire/useLiveDocument";

type UseProfile = (options: {
  auth?: FireAuthUser | RefiAuthUser;
}) => LoadStatus & {
  auth?: FireAuthUser | RefiAuthUser;
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: UserWithId;
  userId?: UserId;
  isTester: boolean;
};

export const useProfile: UseProfile = (props) => {
  const auth = props?.auth;
  const userId = auth?.uid as UserId | undefined;

  const result = useLiveDocument<UserWithLocation>([COLLECTION_USERS, userId]);
  const data = result.data;
  const loadStatus: LoadStatus = omit("data", result);

  const profile: Profile | undefined = useMemo(
    () => (data ? omitLocationFromUser(data) : undefined),
    [data]
  );

  const userLocation: UserLocation | undefined = useMemo(
    () => (data ? extractLocationFromUser(data) : undefined),
    [data]
  );

  const userWithId: UserWithId | undefined = useMemo(
    () =>
      userId && auth && profile
        ? withId(
            {
              ...profile,
              partyName: profile.partyName ?? auth.displayName ?? "",
              pictureUrl: profile.pictureUrl ?? auth.photoURL ?? "",
            },
            userId
          )
        : undefined,
    [auth, userId, profile]
  );

  const isTester = useMemo(() => !!profile?.tester, [profile?.tester]);

  return useMemo(
    () => ({
      ...loadStatus,
      auth,
      profile,
      userLocation,
      userWithId,
      userId,
      isTester,
    }),
    [auth, profile, userLocation, userWithId, userId, isTester, loadStatus]
  );
};
