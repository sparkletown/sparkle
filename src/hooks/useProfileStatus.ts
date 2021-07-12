import { useCallback } from "react";

import { useUser } from "hooks/useUser";

import { updateUserOnlineStatus } from "api/profile";

export const useProfileStatus = () => {
  const { userId, profile } = useUser();

  const changeUserStatus = useCallback(
    (newStatus?: string) => {
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
