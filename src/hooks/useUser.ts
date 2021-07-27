import { useMemo } from "react";
import { FirebaseReducer } from "react-redux-firebase";
import { isEqual } from "lodash";

import { User } from "types/User";

import { withId, WithId } from "utils/id";
import { authSelector, profileSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

export interface UseUserResult {
  user?: FirebaseReducer.AuthState;
  profile?: FirebaseReducer.Profile<User>;
  userWithId?: WithId<User>;
  userId?: string;
}

export const useUser = (): UseUserResult => {
  const auth = useSelector(authSelector, isEqual);
  const profile = useSelector(profileSelector, isEqual);

  return useMemo(
    () => ({
      user: !auth.isEmpty ? auth : undefined,
      profile: !profile.isEmpty ? profile : undefined,
      userWithId: auth && profile ? withId(profile, auth.uid) : undefined,
      userId: auth && profile ? auth.uid : undefined,
    }),
    [auth, profile]
  );
};
