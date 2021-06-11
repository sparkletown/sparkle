import { DefaultUserStatus, User } from "types/User";

import { USER_STATUSES } from "settings";
import { WithId } from "utils/id";
import { useRelatedVenues } from "./useRelatedVenues";
import { useSovereignVenueId } from "./useSovereignVenueId";

export const useVenueUserStatuses = (venueId?: string, user?: WithId<User>) => {
  const { sovereignVenueId } = useSovereignVenueId({ venueId });

  // Using currentVenueNG hook
  const { currentVenue: venue } = useRelatedVenues({
    currentVenueId: sovereignVenueId,
  });

  const venueStatuses = venue?.userStatuses ?? [];

  const statuses = [...USER_STATUSES, ...venueStatuses];

  const userStatus = statuses.find(
    (userStatus) => userStatus.status === user?.status
  );

  return {
    venueUserStatuses: venueStatuses,
    venueStatusEnabled: venue?.showUserStatus ?? false,
    userStatus: userStatus ?? {
      status: DefaultUserStatus.online,
      color: "#4BCC4B",
    },
  };
};
