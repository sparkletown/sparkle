import { useCallback } from "react";

import { useUser } from "hooks/useUser";
import { UserStatus } from "types/User";
import { updateUserOnlineStatus } from "api/profile";

export const useProfileStatus = () => {
  const { userId, profile } = useUser();

  const changeStatus = useCallback(
    (value: UserStatus | null) => {
      if (!userId) return;

      updateUserOnlineStatus({
        status: value,
        userId,
      });
    },
    [userId]
  );

  return {
    status: profile?.status,
    changeStatus,
  };
};
