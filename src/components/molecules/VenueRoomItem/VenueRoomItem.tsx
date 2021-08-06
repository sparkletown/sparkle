import React, { useCallback } from "react";
import { faPlus, faInfo } from "@fortawesome/free-solid-svg-icons";

import { VenueRoom } from "types/rooms";

import { CreateRoomResult } from "api/admin";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import { RoomAddModal } from "./RoomAddModal";
import { RoomInfoModal } from "./RoomInfoModal";

import "./VenueRoomItem.scss";

export interface VenueRoomItemProps {
  onAdd: (result: CreateRoomResult) => void;
  venueRoom: VenueRoom;
}

export const VenueRoomItem: React.FC<VenueRoomItemProps> = ({
  onAdd,
  venueRoom,
}) => {
  const {
    isShown: isAddModalVisible,
    show: showAddModal,
    hide: hideAddModal,
  } = useShowHide();
  const {
    isShown: isInfoModalVisible,
    show: showInfoModal,
    hide: hideInfoModal,
  } = useShowHide();

  const { icon, text, template } = venueRoom;

  const onSwitchModals = useCallback(() => {
    hideInfoModal();
    showAddModal();
  }, [hideInfoModal, showAddModal]);

  const onRoomCreate: (result: CreateRoomResult) => void = useCallback(
    (result) => {
      hideAddModal();
      onAdd(result);
    },
    [hideAddModal, onAdd]
  );

  return (
    <>
      <RoomInfoModal
        onAdd={onSwitchModals}
        onHide={hideInfoModal}
        venueRoom={venueRoom}
        show={isInfoModalVisible}
      />
      <RoomAddModal
        onAdd={onRoomCreate}
        onHide={hideAddModal}
        template={template}
        show={isAddModalVisible}
      />
      <div className="VenueRoomItem">
        <div className="VenueRoomItem__icon">
          <img alt={`Icon of ${text}`} src={icon} />
        </div>
        <div className="VenueRoomItem__name">{text}</div>
        <div className="VenueRoomItem__buttons">
          <ButtonNG
            className="VenueRoomItem__button"
            onClick={showInfoModal}
            iconOnly={true}
            iconName={faInfo}
            title="Info about the room"
          />
          <ButtonNG
            className="VenueRoomItem__button"
            onClick={showAddModal}
            iconOnly={true}
            iconName={faPlus}
            variant="primary"
            title="Add room"
          />
        </div>
      </div>
    </>
  );
};
