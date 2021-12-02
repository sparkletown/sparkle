import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { EMPTY_SPACE_SLUG, EMPTY_WORLD_SLUG } from "settings";

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

    enterVenue(
      worldSlug ?? EMPTY_WORLD_SLUG,
      portalSpaceSlug ?? EMPTY_SPACE_SLUG,
      {
        customOpenRelativeUrl: openUrlUsingRouter,
      }
    );
  }, [portalSpaceSlug, worldSlug, openUrlUsingRouter]);

  return {
    enterRoom,
    portalSpaceSlug,
  };
};
