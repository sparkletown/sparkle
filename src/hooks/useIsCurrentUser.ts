import { useUser } from "./useUser";

export const useIsCurrentUser = (otherUserId?: string) => {
  const { userWithId: user } = useUser();

  return otherUserId === user?.id;
};
