import React, { useCallback, useState } from "react";
import { useEffectOnce } from "react-use";
import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapRoomAction,
} from "store/actions/AnimateMap";

import { Room } from "types/rooms";
import { AnimateMapVenue } from "types/venues";

import { PortalModal } from "components/templates/PartyMap/components/PortalModal";

import { EventProvider, EventType } from "../../../EventProvider";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { UIPlayerClickHandler } from "../PlayerContextMenu/PlayerContextMenu";
import { Shoutouter } from "../Shoutouter/Shoutouter";
import { SingleButton } from "../SingleButton/SingleButton";
import { TooltipWidget } from "../TooltipWidget/TooltipWidget";
import { UIContainer } from "../UIContainer/UIContainer";

import CentreIcon from "assets/images/AnimateMap/UI/icon-aim.svg";

import "./UIOverlayGrid.scss";

export interface UIOverlayGridProps {
  venue: AnimateMapVenue;
}

export const UIOverlayGrid: React.FC<UIOverlayGridProps> = ({
  venue,
  children,
}) => {
  const eventProvider = EventProvider;
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const hasSelectedRoom = !!selectedRoom;

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

  return (
    <div className="UIOverlay">
      <div className="UIOverlayGrid">
        <PortalModal
          portal={selectedRoom}
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
        <div className="UIOverlayGrid__contextmenu">
          <UIPlayerClickHandler />
        </div>
        <div className="UIOverlayGrid__shoutouter">
          <Shoutouter />
        </div>
      </div>
    </div>
  );
};
