import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Room } from "types/rooms";

import { enterSpace } from "utils/url";

import { useSpaceParams } from "./spaces/useSpaceParams";
import { useRelatedVenues } from "./useRelatedVenues";

export interface UseRoomProps {
  room?: Room;
}
export const useRoom = ({ room }: UseRoomProps) => {
  const targetSpaceId = room?.spaceId;

  const { push: openUrlUsingRouter } = useHistory();
  const { worldSlug } = useSpaceParams();

  const { findVenueInRelatedVenues } = useRelatedVenues();

  const enterRoom = useCallback(() => {
    if (targetSpaceId) {
      const targetSpace = findVenueInRelatedVenues({ spaceId: targetSpaceId });
      if (targetSpace) {
        enterSpace(worldSlug, targetSpace?.slug, {
          customOpenRelativeUrl: openUrlUsingRouter,
        });
      }
    }
  }, [findVenueInRelatedVenues, targetSpaceId, worldSlug, openUrlUsingRouter]);

  return {
    enterRoom,
    portalSpaceId: room?.spaceId,
  };
};
