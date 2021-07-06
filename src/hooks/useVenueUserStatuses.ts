import {
  ONLINE_USER_STATUS,
  DEFAULT_SHOW_USER_STATUSES,
  USER_STATUSES,
} from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useConnectSovereignVenue } from "./useConnectSovereignVenue";

export const useVenueUserStatuses = (venueId?: string, user?: WithId<User>) => {
  const { sovereignVenue } = useConnectSovereignVenue(venueId);

  const venueStatuses = sovereignVenue?.userStatuses ?? [];

  const statuses = [...USER_STATUSES, ...venueStatuses];

  const userStatus = statuses.find(
    (userStatus) => userStatus.status === user?.status
  );

  return {
    venueUserStatuses: venueStatuses,
    isStatusEnabledForVenue:
      sovereignVenue?.showUserStatus ?? DEFAULT_SHOW_USER_STATUSES,
    userStatus: userStatus ?? ONLINE_USER_STATUS,
  };
};
