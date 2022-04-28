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

  const { worldSpacesById } = useRelatedVenues();

  const enterPortal = useCallback(() => {
    if (targetSpaceId) {
      const targetSpace = targetSpaceId && worldSpacesById[targetSpaceId];
      if (targetSpace) {
        enterSpace(worldSlug, targetSpace?.slug, {
          customOpenRelativeUrl: openUrlUsingRouter,
        });
      }
    }
  }, [targetSpaceId, worldSpacesById, worldSlug, openUrlUsingRouter]);

  return {
    enterPortal,
    portalSpaceId: portal?.spaceId,
  };
};
