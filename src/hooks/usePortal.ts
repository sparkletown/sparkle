import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Room } from "types/rooms";

import { enterSpace } from "utils/url";

import { useSpaceParams } from "./spaces/useSpaceParams";
import { useRelatedVenues } from "./useRelatedVenues";

interface UsePortalProps {
  portal?: Room;
}
export const usePortal = ({ portal }: UsePortalProps) => {
  const targetSpaceId = portal?.spaceId;

  const { push: openUrlUsingRouter } = useHistory();
  const { worldSlug } = useSpaceParams();

  const { findVenueInRelatedVenues } = useRelatedVenues();

  const enterPortal = useCallback(() => {
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
    enterPortal,
    portalSpaceId: portal?.spaceId,
  };
};
