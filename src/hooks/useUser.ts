import { useMemo } from "react";
import { FirebaseReducer } from "react-redux-firebase";
import { isEqual } from "lodash";

import { RootState } from "store";

import { User, UserLocation } from "types/User";

import { WithId, withId } from "utils/id";
import { authSelector, profileSelector } from "utils/selectors";
import { extractLocationFromUser, omitLocationFromUser } from "utils/user";

import { useSelector } from "hooks/useSelector";

export interface UseUserResult {
  user?: FirebaseReducer.AuthState;
  profile?: FirebaseReducer.Profile<User>;
  userLocation?: UserLocation;
  userWithId?: WithId<User>;
  userId?: string;
}

export const useUser = (): UseUserResult => {
  const user = useSelector((state: RootState) => {
    const auth = authSelector(state);

    return !auth.isEmpty ? auth : undefined;
  }, isEqual);

  const profileWithLocation = useSelector((state: RootState) => {
    const profile = profileSelector(state);

    return !profile.isEmpty ? profile : undefined;
  }, isEqual);

  const userId = user?.uid;

  const profile = profileWithLocation
    ? omitLocationFromUser(profileWithLocation)
    : undefined;

  const userLocation = profileWithLocation
    ? extractLocationFromUser(profileWithLocation)
    : undefined;

  const userWithId = useMemo(() => {
    if (!userId || !profile) return;

    return withId(profile, userId);
  }, [profile, userId]);

  return useMemo(
    () => ({
      user,
      profile,
      userLocation,
      userWithId,
      userId,
    }),
    [user, profile, userLocation, userWithId, userId]
  );
};
