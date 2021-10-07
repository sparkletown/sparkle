import React from "react";

import { ROOM_TAXON } from "settings";

import { VenueTemplate } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { VenueRoomModal } from "components/molecules/VenueRoomModal";

import "./VenueRoomItem.scss";

export interface VenueRoomItemProps {
  icon: string;
  text: string;
  template?: VenueTemplate;
  worldId: string;
}

export const VenueRoomItem: React.FC<VenueRoomItemProps> = ({
  icon,
  text,
  template,
  worldId,
}) => {
  const {
    isShown: isModalVisible,
    show: showModal,
    hide: hideModal,
  } = useShowHide();

  return (
    <>
      <VenueRoomModal
        icon={icon}
        template={template}
        worldId={worldId}
        isModalVisible={isModalVisible}
        hideModal={hideModal}
      />
      <div className="VenueRoomItem" onClick={showModal}>
        <img
          alt={`${ROOM_TAXON.lower} icon ${icon}`}
          src={icon}
          className="VenueRoomItem__room-icon"
        />
        <div>{text}</div>
      </div>
    </>
  );
};
