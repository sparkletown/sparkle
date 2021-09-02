import { useCallback, useMemo } from "react";

import { Room } from "types/rooms";

import { enterVenue } from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRecentLocationUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

export interface UseRoomProps {
  room?: Room;
  venueId: string;
}
export const useRoom = ({ room, venueId }: UseRoomProps) => {
  const { user } = useUser();
  const userId = user?.uid;

  const roomUrl = room?.url ?? "";

  // @debt pass venueId taken from UseRoomProps through to useRelatedVenues
  const { relatedVenues } = useRelatedVenues({});

  const roomVenue = useMemo(
    () => relatedVenues.find((venue) => roomUrl.endsWith(`/${venue.id}`)),
    [roomUrl, relatedVenues]
  );

  const { recentLocationUsers } = useRecentLocationUsers({
    venueId,
  });

  const enterRoom = useCallback(() => {
    if (!userId || !roomVenue) return;

    enterVenue(roomVenue.id);
  }, [userId, roomVenue]);

  return {
    enterRoom,
    recentRoomUsers: recentLocationUsers,
  };
};
