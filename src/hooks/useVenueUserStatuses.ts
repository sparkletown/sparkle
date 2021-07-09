import { useCallback } from "react";

import { updateUserOnlineStatus } from "api/profile";

import { DEFAULT_USER_STATUS, DEFAULT_SHOW_USER_STATUSES } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useSovereignVenue } from "./useSovereignVenue";
import { useUser } from "./useUser";

export const useVenueUserStatuses = (venueId?: string, user?: WithId<User>) => {
  const { sovereignVenue } = useSovereignVenue({ venueId });
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

  const venueStatuses = sovereignVenue?.userStatuses ?? [];

  const userStatus = venueStatuses.find(
    (userStatus) => userStatus.status === user?.status
  );

  return {
    changeUserStatus,
    venueUserStatuses: venueStatuses,
    isStatusEnabledForVenue:
      sovereignVenue?.showUserStatus ?? DEFAULT_SHOW_USER_STATUSES,
    userStatus: userStatus ?? {
      status: profile?.status ?? "",
      color: DEFAULT_USER_STATUS.color,
    },
  };
};
