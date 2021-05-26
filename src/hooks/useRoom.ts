import { useCallback, useMemo } from "react";

import { Room } from "types/rooms";

import { enterExternalRoom } from "utils/userLocation";
import { orderedVenuesSelector } from "utils/selectors";
import { enterVenue } from "utils/url";
import { getExternalRoomSlug } from "utils/room";

import { useSelector } from "hooks/useSelector";
import { useRecentLocationUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

export interface UseRoomProps {
  room?: Room;
  venueName: string;
}

export const useRoom = ({ room, venueName }: UseRoomProps) => {
  const { user } = useUser();
  const userId = user?.uid;

  const roomUrl = room?.url ?? "";

  // @debt This selector relies on all venues in firebase being loaded into memory.. not very efficient
  const venues = useSelector(orderedVenuesSelector);

  const roomVenue = useMemo(
    () => venues?.find((venue) => roomUrl.endsWith(`/${venue.id}`)),
    [roomUrl, venues]
  );

  // @debt we should replace externalRoomSlug with preferrably room id
  const roomSlug = roomVenue
    ? roomVenue.name
    : getExternalRoomSlug({ roomTitle: room?.title, venueName });

  const { recentLocationUsers } = useRecentLocationUsers(roomSlug);

  const enterRoom = useCallback(() => {
    if (!userId) return;

    roomVenue
      ? enterVenue(roomVenue.id)
      : enterExternalRoom({ userId, roomUrl, locationName: roomSlug });
  }, [roomSlug, roomUrl, userId, roomVenue]);

  return {
    enterRoom,
    recentRoomUsers: recentLocationUsers,
  };
};
