import { useMemo } from "react";

import { Room } from "types/rooms";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRecentLocationUsers } from "hooks/users";

export interface useRoomListProps {
  roomList?: Room[];
}

export const useRoomList = ({ roomList }: useRoomListProps) => {
  const roomUrls = roomList?.map(
    (room) => room?.title.toLowerCase().replaceAll(" ", "") ?? ""
  );
  const { relatedVenues } = useRelatedVenues({});

  const roomVenue = useMemo(
    () =>
      relatedVenues.filter((venue) => {
        return roomUrls?.filter((room) => room.endsWith(`${venue.id}`)).length;
      }),
    [relatedVenues, roomUrls]
  );
  const roomSlug =
    roomVenue && roomVenue.map((el) => `${el.parentId}/${el.name}`);
  const { recentLocationUsers } = useRecentLocationUsers({
    locationName: roomSlug,
  });
  return {
    recentRoomUsers: recentLocationUsers as readonly WithId<User>[][],
  };
};
