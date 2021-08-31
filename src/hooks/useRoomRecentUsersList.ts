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
  const roomSlugs =
    eventList &&
    eventList.map((el) => `${el.venueId.trim()}/${el.room?.trim()}`);
  const { recentLocationUsers } = useVisitedLocationsUser({
    locationNames: roomSlugs,
  });
  const formattedUsers = recentLocationUsers.filter((x) => !!x.length);
  return formattedUsers;
};
