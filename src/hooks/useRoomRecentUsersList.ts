import { useMemo } from "react";

import { Room } from "types/rooms";

import { getRoomUrl } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import { useVisitedLocationsUser } from "./users/useVisitedLocationsUser";

export interface UseRoomRecentUsersListProps {
  roomList?: Room[];
}

export const useRoomRecentUsersList = ({
  roomList,
}: UseRoomRecentUsersListProps) => {
  const roomUrls = roomList?.map((room) => getRoomUrl(room.url) ?? "");
  const { relatedVenues } = useRelatedVenues({});
  const matchedRoomVenues = useMemo(
    () =>
      relatedVenues.filter(
        (venue) => roomUrls?.filter((url) => url.endsWith(venue.id)).length
      ),
    [relatedVenues, roomUrls]
  );
  const roomSlugs =
    matchedRoomVenues &&
    matchedRoomVenues.map((el) => `${el.parentId}/${el.name}`);
  const { recentLocationUsers } = useVisitedLocationsUser({
    locationNames: roomSlugs,
  });

  return recentLocationUsers;
};
