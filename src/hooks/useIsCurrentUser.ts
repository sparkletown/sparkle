import { useUser } from "./useUser";

export const useIsCurrentUser = (otherUserId?: string) => {
  const { userId } = useUser();

  return otherUserId === userId;
};
