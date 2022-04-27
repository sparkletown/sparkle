import React, { useCallback, useEffect, useState } from "react";
import EventProvider, {
  EventType,
} from "common/AnimateMap/bridges/EventProvider/EventProvider";

import { Room } from "types/rooms";

import { PortalModal } from "components/templates/PartyMap/components/PortalModal";

import {
  AnimateMapActionTypes,
  AnimateMapRoom,
  AnimateMapSpace,
  setAnimateMapRoomAction,
  SubscribeActionAfterListener,
} from "../../AnimateMapCommon";

import { AnimateMapContorlPanel } from "./AnimateMapContorlPanel";
import { AnimateMapShoutouter } from "./AnimateMapShoutouter";
import { AnimateMapSingleButton } from "./AnimateMapSingleButton";
import { AnimateMapTooltipWidget } from "./AnimateMapTooltipWidget";
import { AnimateMapUIContainer } from "./AnimateMapUIContainer";
import { AnimateMapUIPlayerClickHandler } from "./AnimateMapUIPlayerClickHandler";

import CentreIcon from "assets/images/AnimateMap/UI/icon-aim.svg";

import "./AnimateMapUIOverlayGrid.scss";

export interface AnimateMapUIOverlayGridProps {
  venue: AnimateMapSpace;
  subscribeActionAfter: (
    action: string,
    listener: SubscribeActionAfterListener
  ) => () => void;
  onSetAnimateMapZoom: (zoom: number) => void;
  onSetAnimateMapRoom: (room: AnimateMapRoom) => void;
}

export const AnimateMapUIOverlayGrid: React.FC<AnimateMapUIOverlayGridProps> = (
  props
) => {
  const [selectedRoom, setSelectedRoom] = useState<
    AnimateMapRoom | undefined
  >();
  const hasSelectedRoom = !!selectedRoom;

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  const handleEventProvider = useCallback(() => {
    EventProvider.emit(EventType.UI_SINGLE_BUTTON_FOLLOW);
  }, []);

  useEffect(() => {
    const unsubscribe = props.subscribeActionAfter(
      AnimateMapActionTypes.SET_ROOM,
      (action) => {
        setSelectedRoom((action as setAnimateMapRoomAction).payload.room);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [props]);

  return (
    <div className="UIOverlay">
      <div className="UIOverlayGrid">
        <PortalModal
          portal={(selectedRoom as unknown) as Room}
          show={hasSelectedRoom}
          onHide={unselectRoom}
        />

        <div className="UIOverlayGrid__zoom">
          <AnimateMapUIContainer venue={props.venue}>
            <AnimateMapContorlPanel
              onSetAnimateMapZoom={props.onSetAnimateMapZoom}
              subscribeActionAfter={props.subscribeActionAfter}
            />
          </AnimateMapUIContainer>
        </div>

        <div className="UIOverlayGrid__center">
          <AnimateMapUIContainer venue={props.venue}>
            <AnimateMapSingleButton
              onClick={handleEventProvider}
              icon={CentreIcon}
              alt="map-icon"
            />
          </AnimateMapUIContainer>
        </div>

        <div className="UIOverlayGrid__tooltip">
          <AnimateMapUIContainer venue={props.venue} disableInteractive>
            <AnimateMapTooltipWidget
              onSetAnimateMapRoom={props.onSetAnimateMapRoom}
            />
          </AnimateMapUIContainer>
        </div>
        <div className="UIOverlayGrid__contextmenu">
          <AnimateMapUIPlayerClickHandler />
        </div>
        <div className="UIOverlayGrid__shoutouter">
          <AnimateMapShoutouter />
        </div>
      </div>
    </div>
  );
};
