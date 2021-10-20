import { User } from "types/User";

import { WithId } from "utils/id";

import { useUser } from "./useUser";

export const useIsCurrentUser = (otherUser?: WithId<User>) => {
  const { userWithId: user } = useUser();

  return otherUser?.id === user?.id;
};
