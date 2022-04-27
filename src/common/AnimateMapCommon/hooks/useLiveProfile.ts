import { useMemo } from "react";
import { omit } from "lodash/fp";

import { COLLECTION_USERS, DEFERRED } from "../settings";

import { AnimateMapFireAuthUser } from "../AnimateMapFireAuthUser";
import { UserId, UserWithId, withId } from "../AnimateMapIds";
import { AnimateMapLoadStatus } from "../AnimateMapLoadStatus";
import { Profile, UserLocation, UserWithLocation } from "../AnimateMapUser";
import { extractLocationFromUser, omitLocationFromUser } from "../utils";

import { useLiveDocument } from "./useLiveDocument";

type UseLiveProfile = (options: {
  auth?: AnimateMapFireAuthUser;
}) => AnimateMapLoadStatus & {
  auth?: AnimateMapFireAuthUser;
  profile?: Profile;
  userLocation?: UserLocation;
  userWithId?: UserWithId;
  userId?: UserId;
  isTester: boolean;
};

export const useLiveProfile: UseLiveProfile = (props) => {
  const auth = props?.auth;
  const userId = auth?.uid as UserId | undefined;

  const result = useLiveDocument<UserWithLocation>(
    userId ? [COLLECTION_USERS, userId] : DEFERRED
  );
  const data = result.data;
  const loadStatus: AnimateMapLoadStatus = omit("data", result);

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
