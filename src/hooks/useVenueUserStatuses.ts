import { ONLINE_USER_STATUS, USER_STATUSES } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useRelatedVenues } from "./useRelatedVenues";
import { useSovereignVenueId } from "./useSovereignVenueId";

export const useVenueUserStatuses = (venueId?: string, user?: WithId<User>) => {
  const { sovereignVenueId } = useSovereignVenueId({ venueId });

  // Using currentVenueNG hook
  const { currentVenue: venue } = useRelatedVenues({
    currentVenueId: sovereignVenueId,
  });

  console.log(venue?.id, venue?.userStatuses);
  const venueStatuses = venue?.userStatuses ?? [];

  const statuses = [...USER_STATUSES, ...venueStatuses];

  const userStatus = statuses.find(
    (userStatus) => userStatus.status === user?.status
  );

  return {
    venueUserStatuses: venueStatuses,
    isStatusEnabledForVenue: venue?.showUserStatus ?? false,
    userStatus: userStatus ?? ONLINE_USER_STATUS,
  };
};
