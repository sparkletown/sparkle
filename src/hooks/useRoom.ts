import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Room } from "types/rooms";
import { SpaceSlug } from "types/venues";

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
  const { worldSlug } = useSpaceParams();

  const noTrailSlashPortalUrl = roomUrl && getUrlWithoutTrailingSlash(roomUrl);

  const [portalSpaceSlug] = getLastUrlParam(noTrailSlashPortalUrl) as [
    SpaceSlug
  ];

  const enterRoom = useCallback(() => {
    if (!portalSpaceSlug) return;

    // TODO This should be using the venue from the portal itself. At the moment
    // portal URLs are stored using the old way.
    enterVenue(worldSlug ?? "", portalSpaceSlug ?? "", {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
  }, [portalSpaceSlug, worldSlug, openUrlUsingRouter]);

  return {
    enterRoom,
    portalSpaceSlug,
  };
};
