import { useCallback } from "react";

import { Room } from "types/rooms";

import {
  enterVenue,
  getLastUrlParam,
  getUrlWithoutTrailingSlash,
} from "utils/url";

export interface UseRoomProps {
  room?: Room;
}
export const useRoom = ({ room }: UseRoomProps) => {
  const roomUrl = room?.url ?? "";

  const noTrailSlashPortalUrl = roomUrl && getUrlWithoutTrailingSlash(roomUrl);

  const [portalVenueId] = getLastUrlParam(noTrailSlashPortalUrl);

  const enterRoom = useCallback(() => {
    if (!portalVenueId) return;

    enterVenue(portalVenueId);
  }, [portalVenueId]);

  return {
    enterRoom,
    portalVenueId,
  };
};
