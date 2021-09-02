import { useCallback, useMemo } from "react";

import { Room } from "types/rooms";

import {
  enterVenue,
  getLastUrlParam,
  getUrlWithoutTrailingSlash,
} from "utils/url";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRecentLocationUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

export interface UseRoomProps {
  room?: Room;
}
export const useRoom = ({ room }: UseRoomProps) => {
  const { user } = useUser();
  const userId = user?.uid;

  const roomUrl = room?.url ?? "";

  const noTrailSlashPortalUrl = roomUrl && getUrlWithoutTrailingSlash(roomUrl);

  const [portalVenueId] = getLastUrlParam(noTrailSlashPortalUrl);

  // @debt pass venueId taken from UseRoomProps through to useRelatedVenues
  const { relatedVenues } = useRelatedVenues({});

  const roomVenue = useMemo(
    () => relatedVenues.find((venue) => roomUrl.endsWith(`/${venue.id}`)),
    [roomUrl, relatedVenues]
  );

  const { recentLocationUsers } = useRecentLocationUsers({
    venueId: portalVenueId,
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
