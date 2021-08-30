import { useMemo } from "react";

import { Room } from "types/rooms";

import { getExternalRoomSlug } from "utils/room";
import { getRoomUrl } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import { useVisitedLocationsUser } from "./users/useVisitedLocationsUser";

export interface UseRoomRecentUsersListProps {
  roomList?: Room[];
  venueId: string;
}

export const useRoomRecentUsersList = ({
  roomList,
  venueId,
}: UseRoomRecentUsersListProps) => {
  const roomUrls = roomList?.map((room) =>
    room?.url ? getRoomUrl(room.url) : ""
  );
  const { relatedVenues } = useRelatedVenues({});
  const matchedRoomVenues = useMemo(
    () =>
      relatedVenues.filter(
        (venue) =>
          roomUrls?.filter(
            (url, index) =>
              url.endsWith(venue.id) ||
              getExternalRoomSlug({
                roomTitle: roomList && roomList[index].title,
                venueName: venueId,
              })
          ).length
      ),
    [relatedVenues, roomUrls, venueId, roomList]
  );
  const roomSlugs =
    matchedRoomVenues &&
    matchedRoomVenues.map((el) => `${el.parentId}/${el.name}`);
  const { recentLocationUsers } = useVisitedLocationsUser({
    locationNames: roomSlugs,
  });

  const filteredRecentUsers = recentLocationUsers?.filter(
    (userLocation) => !!userLocation.length
  );
  return filteredRecentUsers;
};
