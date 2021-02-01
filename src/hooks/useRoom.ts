import { useCallback, useMemo } from "react";

import { Room } from "types/rooms";

import { enterExternalRoom } from "utils/userLocation";
import { orderedVenuesSelector } from "utils/selectors";
import { enterVenue } from "utils/url";

import { useSelector } from "hooks/useSelector";
import { useRecentLocationUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

export const useRoom = (room: Room) => {
  const { user } = useUser();
  const userId = user?.uid;

  const roomUrl = room.url;

  const venues = useSelector(orderedVenuesSelector);

  const roomVenue = useMemo(
    () => venues?.find((venue) => roomUrl.endsWith(`/${venue.id}`)),
    [roomUrl, venues]
  );
  const roomId = roomVenue ? roomVenue.name : room.url;

  const { recentLocationUsers } = useRecentLocationUsers(roomId);

  const enterRoom = useCallback(() => {
    if (!userId) return;

    roomVenue ? enterVenue(roomVenue.id) : enterExternalRoom({ userId, room });
  }, [room, userId, roomVenue]);

  return {
    enterRoom,
    recentRoomUsers: recentLocationUsers,
  };
};
