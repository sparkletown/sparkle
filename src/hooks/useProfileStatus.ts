import { useCallback } from "react";

import { useUser } from "hooks/useUser";
import { UserStatus } from "types/User";
import { updateUserOnlineStatus } from "api/profile";

export const useProfileStatus = () => {
  const { userWithId, profile } = useUser();

  const changeStatus = useCallback(
    (value: UserStatus) => {
      if (userWithId) {
        updateUserOnlineStatus({
          status: value,
          userId: userWithId?.id,
        });
      }
    },
    [userWithId]
  );

  return {
    status: profile?.status ?? "",
    changeStatus,
  };
};
