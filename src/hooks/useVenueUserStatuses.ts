import { DEFAULT_USER_STATUS, DEFAULT_SHOW_USER_STATUSES } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useSovereignVenue } from "./useSovereignVenue";

export const useVenueUserStatuses = (venueId?: string, user?: WithId<User>) => {
  const { sovereignVenue } = useSovereignVenue({ venueId });

  const venueStatuses = sovereignVenue?.userStatuses ?? [];

  const userStatus = venueStatuses.find(
    (userStatus) => userStatus.status === user?.status
  );

  return {
    venueUserStatuses: venueStatuses,
    isStatusEnabledForVenue:
      sovereignVenue?.showUserStatus ?? DEFAULT_SHOW_USER_STATUSES,
    userStatus: userStatus ?? DEFAULT_USER_STATUS,
  };
};
