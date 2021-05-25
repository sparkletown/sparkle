import { useCallback } from "react";

import { useUser } from "hooks/useUser";
import { UserStatus } from "types/User";
import { updateUserOnlineStatus } from "api/profile";

export const useProfileStatus = () => {
  const { userId, profile } = useUser();

  const changeUserStatus = useCallback(
    (newStatus?: UserStatus) => {
      if (!userId) return;

      updateUserOnlineStatus({
        status: newStatus,
        userId,
      });
    },
    [userId]
  );

  return {
    status: profile?.status,
    changeUserStatus,
  };
};
