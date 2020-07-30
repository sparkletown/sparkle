import { useSelector } from "./useSelector";

export const useUser = () => {
  const { auth, profile } = useSelector((state) => state.firebase);
  return {
    user: !auth.isEmpty ? auth : undefined,
    profile: !profile.isEmpty ? profile : undefined,
  };
};
