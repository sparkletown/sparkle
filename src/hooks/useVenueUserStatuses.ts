import { useCallback, useMemo } from "react";

import { DEFAULT_SHOW_USER_STATUSES, DEFAULT_USER_STATUS } from "settings";

import { updateUserOnlineStatus } from "api/profile";

import { User, UserStatus } from "types/User";

import { WithId } from "utils/id";

import { useLiveUser } from "./user/useLiveUser";
import { useRelatedVenues } from "./useRelatedVenues";

const emptyStatuses: UserStatus[] = [];

export const useVenueUserStatuses = (user?: WithId<User>) => {
  const { sovereignVenue } = useRelatedVenues();
  const { userId, profile } = useLiveUser();

  // @debt replace this with useAsync / useAsyncFn / similar
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

  const venueUserStatuses = sovereignVenue?.userStatuses ?? emptyStatuses;

  const userStatus = useMemo(
    () =>
      venueUserStatuses.find(({ status }) => status === user?.status) ?? {
        status: profile?.status ?? DEFAULT_USER_STATUS.status,
        color: venueUserStatuses[0]?.color ?? DEFAULT_USER_STATUS.color,
      },
    [profile?.status, user?.status, venueUserStatuses]
  );

  return {
    changeUserStatus,
    venueUserStatuses,
    isStatusEnabledForVenue:
      sovereignVenue?.showUserStatus ?? DEFAULT_SHOW_USER_STATUSES,
    userStatus,
  };
};
