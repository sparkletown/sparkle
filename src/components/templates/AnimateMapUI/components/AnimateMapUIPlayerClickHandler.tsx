import React, { useCallback, useEffect } from "react";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import EventProvider, {
  EventType,
} from "../../AnimateMap/bridges/EventProvider/EventProvider";
import { AnimateMapUser, UserId } from "../../AnimateMapCommon";

import "./AnimateMapUIPlayerClickHandler.scss";
export interface AnimateMapUIPlayerClickHandlerProps {}

export const AnimateMapUIPlayerClickHandler: React.FC<AnimateMapUIPlayerClickHandlerProps> = () => {
  const { openUserProfileModal } = useProfileModalControls();

  const viewProfileHandler = useCallback(
    (user: AnimateMapUser, viewportX: number, viewportY: number) => {
      openUserProfileModal(user.data.id as UserId);
    },
    [openUserProfileModal]
  );

  useEffect(() => {
    EventProvider.on(EventType.ON_REPLICATED_USER_CLICK, viewProfileHandler);
    return () => {
      EventProvider.off(EventType.ON_REPLICATED_USER_CLICK, viewProfileHandler);
    };
  }, [viewProfileHandler]);

  return <div />;
};
