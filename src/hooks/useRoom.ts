import { useCallback, useMemo } from "react";

import { Room } from "types/rooms";

import { enterVenue, enterExternalRoom } from "utils/userLocation";
import { orderedVenuesSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useRecentLocationUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

export const useRoom = (room: Room) => {
  const { user } = useUser();
  const userId = user?.uid;

  const venues = useSelector(orderedVenuesSelector);

  const roomVenue = useMemo(
    () => venues?.find((venue) => room.url.endsWith(`/${venue.id}`)),
    [room, venues]
  );
  const roomId = roomVenue ? roomVenue.name : room.url;

  const { recentLocationUsers } = useRecentLocationUsers(roomId);

  const enterRoom = useCallback(() => {
    if (!userId) return;

    if (roomVenue) {
      enterVenue(roomVenue.id);

      return;
    }

    enterExternalRoom({ userId, room });
  }, [room, userId, roomVenue]);

  return {
    enterRoom,
    recentRoomUsers: recentLocationUsers,
  };
};
