import { WithId } from "utils/id";
import { User } from "types/User";
import { useUser } from "./useUser";

export const useIsSameUser = (otherUser?: WithId<User>) => {
  const { userWithId: user } = useUser();

  return otherUser?.id === user?.id;
};
