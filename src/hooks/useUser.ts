import { authSelector, profileSelector } from "utils/selectors";
import { useSelector } from "hooks/useSelector";
import { FirebaseReducer } from "react-redux-firebase";
import { User } from "types/User";

type UseUserResult = {
  user: FirebaseReducer.AuthState | undefined;
  profile: FirebaseReducer.Profile<User> | undefined;
};

export const useUser = (): UseUserResult => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: !profile.isEmpty ? profile : undefined,
  };
};
