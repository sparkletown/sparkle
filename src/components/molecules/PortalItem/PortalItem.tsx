import React, { useCallback } from "react";
import { faPlus, faInfo } from "@fortawesome/free-solid-svg-icons";

import { Portal } from "types/rooms";

import { CreateRoomResult } from "api/admin";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import { RoomAddModal } from "./RoomAddModal";
import { RoomInfoModal } from "./RoomInfoModal";

import "./PortalItem.scss";

export interface PortalItemProps {
  onAdd: (result: CreateRoomResult) => void;
  portal: Portal;
}

export const PortalItem: React.FC<PortalItemProps> = ({ onAdd, portal }) => {
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

  const { icon, text, template } = portal;

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
        portal={portal}
        show={isInfoModalVisible}
      />
      <RoomAddModal
        onAdd={onRoomCreate}
        onHide={hideAddModal}
        template={template}
        show={isAddModalVisible}
      />
      <div className="PortalItem">
        <div className="PortalItem__icon">
          <img alt={`Icon of ${text}`} src={icon} />
        </div>
        <div className="PortalItem__name">{text}</div>
        <div className="PortalItem__buttons">
          <ButtonNG
            className="PortalItem__button"
            onClick={showInfoModal}
            iconOnly={true}
            iconName={faInfo}
            title="Info about the room"
          />
          <ButtonNG
            className="PortalItem__button"
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
