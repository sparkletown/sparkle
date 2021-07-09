import { useCallback, useMemo } from "react";

import { Room } from "types/rooms";

import { enterExternalRoom } from "utils/userLocation";
import { enterVenue } from "utils/url";
import { getExternalRoomSlug } from "utils/room";

import { useRecentLocationUsers } from "hooks/users";
import { useUser } from "hooks/useUser";
import { useRelatedVenues } from "./useRelatedVenues";

export interface UseRoomProps {
  room?: Room;
  venueName: string;
}

export const useRoom = ({ room, venueName }: UseRoomProps) => {
  const { user } = useUser();
  const userId = user?.uid;

  const roomUrl = room?.url ?? "";

  const { relatedVenues } = useRelatedVenues({});

  const roomVenue = useMemo(
    () => relatedVenues.find((venue) => roomUrl.endsWith(`/${venue.id}`)),
    [roomUrl, relatedVenues]
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
