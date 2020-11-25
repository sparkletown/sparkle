import { authSelector, profileSelector } from "utils/selectors";
import { useSelector } from "hooks/useSelector";

export const useUser = () => {
  const auth = useSelector(authSelector);
  const profile = useSelector(profileSelector);

  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: !profile.isEmpty ? profile : undefined,
  };
};
