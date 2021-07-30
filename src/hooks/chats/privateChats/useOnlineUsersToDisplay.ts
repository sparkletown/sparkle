import { useMemo } from "react";

import { useRecentWorldUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

export const useOnlineUsersToDisplay = () => {
  const { recentWorldUsers } = useRecentWorldUsers();
  const { user } = useUser();

  const userId = user?.uid;

  // Filter out self
  return useMemo(() => recentWorldUsers.filter((user) => user.id !== userId), [
    recentWorldUsers,
    userId,
  ]);
};
