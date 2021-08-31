import { useMemo } from "react";

import { Room } from "types/rooms";

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
            (url) =>
              url.endsWith(venue.id) ||
              venue?.rooms?.some((venueRoom) => url.endsWith(venueRoom.title))
          ).length
      ),
    [relatedVenues, roomUrls]
  );
  const roomSlugs =
    matchedRoomVenues &&
    roomUrls &&
    matchedRoomVenues.map((el, index) => {
      if (roomUrls[index].includes("http")) {
        return `${el.parentId}/${el.name}`;
      }
      return `${el.name}/${roomUrls[index].replaceAll("/", "")}`;
    });
  const { recentLocationUsers } = useVisitedLocationsUser({
    locationNames: roomSlugs,
  });
  return recentLocationUsers;
};
