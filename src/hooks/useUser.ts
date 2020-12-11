import { FirebaseReducer } from "react-redux-firebase";

import { User } from "types/User";

import { WithId } from "utils/id";
import { authSelector, profileSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

type UseUserResult = {
  user: FirebaseReducer.AuthState | undefined;
  profile: FirebaseReducer.Profile<User> | undefined;
  userWithId?: WithId<User>;
};

export const useUser = (): UseUserResult => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: !profile.isEmpty ? profile : undefined,
    userWithId: auth && profile ? { ...profile, id: auth.uid } : undefined,
  };
};
