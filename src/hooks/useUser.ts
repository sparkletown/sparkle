import { FirebaseReducer } from "react-redux-firebase";

import { User } from "types/User";

import { WithId } from "utils/id";
import { authSelector, profileSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";

type UseUserResult = {
  user: FirebaseReducer.AuthState | undefined;
  profile: FirebaseReducer.Profile<User> | undefined;
  userWithId?: WithId<User>;
};

export const useUser = (): UseUserResult => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  useFirestoreConnect(
    auth.uid
      ? {
          collection: "users",
          doc: auth.uid,
          storeAs: "profile",
        }
      : undefined
  );

  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: profile && !profile.isEmpty ? profile : undefined,
    userWithId: auth && profile ? { ...profile, id: auth.uid } : undefined,
  };
};
