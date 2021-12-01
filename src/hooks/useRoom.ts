import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Room } from "types/rooms";

import {
  enterVenue,
  getLastUrlParam,
  getUrlWithoutTrailingSlash,
} from "utils/url";

import { useSpaceParams } from "./spaces/useSpaceParams";

export interface UseRoomProps {
  room?: Room;
}
export const useRoom = ({ room }: UseRoomProps) => {
  const roomUrl = room?.url ?? "";

  const { push: openUrlUsingRouter } = useHistory();
  const { worldSlug, spaceSlug } = useSpaceParams();

  const noTrailSlashPortalUrl = roomUrl && getUrlWithoutTrailingSlash(roomUrl);

  const [portalVenueId] = getLastUrlParam(noTrailSlashPortalUrl);

  const enterRoom = useCallback(() => {
    if (!portalVenueId) return;

    // TODO This should be using the venue from the portal itself. At the moment
    // portal URLs are stored using the old way.
    enterVenue(worldSlug ?? "", spaceSlug ?? "", {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
  }, [portalVenueId, worldSlug, spaceSlug, openUrlUsingRouter]);

  return {
    enterRoom,
    portalVenueId,
  };
};
