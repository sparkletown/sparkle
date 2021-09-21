import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Room, RoomData_v2 } from "types/rooms";

import {
  enterVenue,
  getLastUrlParam,
  getUrlWithoutTrailingSlash,
} from "utils/url";

export interface UseRoomProps {
  room?: Room | RoomData_v2;
}
export const useRoom = ({ room }: UseRoomProps) => {
  const roomUrl = room?.url ?? "";

  const { push: openUrlUsingRouter } = useHistory();

  const noTrailSlashPortalUrl = roomUrl && getUrlWithoutTrailingSlash(roomUrl);

  const [portalVenueId] = getLastUrlParam(noTrailSlashPortalUrl);

  const enterRoom = useCallback(() => {
    if (!portalVenueId) return;

    enterVenue(portalVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [portalVenueId, openUrlUsingRouter]);

  return {
    enterRoom,
    portalVenueId,
  };
};
