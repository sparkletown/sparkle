import React, { useCallback, useEffect } from "react";
import { useProfileModalControls } from "common/AnimateMapCommon/hooks";

import {
  AnimateMapEventProvider,
  AnimateMapEventType,
  AnimateMapUser,
  UserId,
} from "../../AnimateMapCommon";

import "./AnimateMapUIPlayerClickHandler.scss";
export interface AnimateMapUIPlayerClickHandlerProps {}

export const AnimateMapUIPlayerClickHandler: React.FC<AnimateMapUIPlayerClickHandlerProps> = (
  props
) => {
  const { openUserProfileModal } = useProfileModalControls();

  const viewProfileHandler = useCallback(
    (user: AnimateMapUser, viewportX: number, viewportY: number) => {
      openUserProfileModal(user.data.id as UserId);
    },
    [openUserProfileModal]
  );

  useEffect(() => {
    AnimateMapEventProvider.on(
      AnimateMapEventType.ON_REPLICATED_USER_CLICK,
      viewProfileHandler
    );
    return () => {
      AnimateMapEventProvider.off(
        AnimateMapEventType.ON_REPLICATED_USER_CLICK,
        viewProfileHandler
      );
    };
  }, [viewProfileHandler]);

  return <div />;
};
