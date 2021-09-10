import { ScheduledVenueEvent } from "types/venues";

import { useVisitedLocationsUser } from "./users/useVisitedLocationsUser";

export interface UseRoomRecentUsersListProps {
  eventList?: ScheduledVenueEvent[];
  venueId: string;
}

export const useRoomRecentUsersList = ({
  eventList,
  venueId,
}: UseRoomRecentUsersListProps) => {
  const portalVenueIds = eventList?.map((event) => event.venueId);
  const { recentLocationUsers } = useVisitedLocationsUser({
    portalVenueIds,
  });
  const formattedUsers = recentLocationUsers.filter((x) => !!x.length);
  return formattedUsers;
};
