import { WithId } from "utils/id";
import { User } from "types/User";
import { useUser } from "./useUser";

export function useSameUser(otherUser?: WithId<User>) {
  const { userWithId: user } = useUser();

  return otherUser?.id === user?.id;
}
