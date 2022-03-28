import { useUserId } from "./user/useUserId";

export const useIsCurrentUser = (otherUserId?: string) => {
  const { userId } = useUserId();

  return otherUserId === userId;
};
