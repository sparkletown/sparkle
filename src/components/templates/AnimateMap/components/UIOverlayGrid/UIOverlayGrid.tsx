import React, { useCallback, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapRoomAction,
} from "store/actions/AnimateMap";

import { Room } from "types/rooms";
import { AnimateMapVenue } from "types/venues";

import { animateMapFirstEntranceSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import { RoomModal } from "../../../PartyMap/components";
import EventProvider, {
  EventType,
} from "../../bridges/EventProvider/EventProvider";
import { T } from "../../game/utils/Keyboard";
import KeyPoll from "../../game/utils/KeyPollSingleton";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { SingleButton } from "../SingleButton/SingleButton";
import { TooltipWidget } from "../TooltipWidget/TooltipWidget";
import { UIContainer } from "../UIContainer/UIContainer";
import { WelcomePopUp } from "../WelcomePopUp/WelcomePopUp";

import CentreIcon from "assets/images/AnimateMap/UI/icon-aim.svg";

import "./UIOverlayGrid.scss";

export interface UIOverlayGridProps {
  venue: AnimateMapVenue;
}

export const UIOverlayGrid: React.FC<UIOverlayGridProps> = ({
  venue,
  children,
}) => {
  // const eventProvider = useSelector(animateMapEventProviderSelector);
  const eventProvider = EventProvider;
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const hasSelectedRoom = !!selectedRoom;
  const firstEntrance = useSelector(animateMapFirstEntranceSelector);

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  useEffectOnce(() => {
    const unsubscribe = subscribeActionAfter(
      AnimateMapActionTypes.SET_ROOM,
      (action) => {
        setSelectedRoom((action as setAnimateMapRoomAction).payload.room);
      }
    );
    return () => {
      unsubscribe();
    };
  });

  /**
   * CODE FOR TEST BLOCK
   */

  const [showTest, setShowTest] = useState(false);
  // const keyPoll = useSelector(animateMapKeyPollSelector);
  useEffect(() => {
    const callback = (type: "down" | "up") => {
      if (type !== "up") return;
      setShowTest(!showTest);
    };
    KeyPoll.on(T, callback);
    return () => {
      KeyPoll.off(T, callback);
    };
  });

  const testBlock = showTest ? (
    <div className="UIOverlayGrid__test">
      <UIContainer venue={venue}></UIContainer>
    </div>
  ) : undefined;

  return (
    <div className="UIOverlayGrid">
      {/*TEST BLOCK START*/}
      {testBlock}
      {/*TEST BLOCK END*/}

      {firstEntrance !== "false" ? <WelcomePopUp /> : ""}

      <RoomModal
        room={selectedRoom}
        venue={venue}
        show={hasSelectedRoom}
        onHide={unselectRoom}
      />

      <div className="UIOverlayGrid__zoom">
        <UIContainer venue={venue}>
          <ControlPanel />
        </UIContainer>
      </div>

      <div className="UIOverlayGrid__center">
        <UIContainer venue={venue}>
          <SingleButton
            onClick={() =>
              eventProvider.emit(EventType.UI_SINGLE_BUTTON_FOLLOW)
            }
            icon={CentreIcon}
            alt="map-icon"
          />
        </UIContainer>
      </div>

      <div className="UIOverlayGrid__tooltip">
        <UIContainer venue={venue} disableInteractive>
          <TooltipWidget />
        </UIContainer>
      </div>
    </div>
  );
};
