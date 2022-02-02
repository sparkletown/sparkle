import React from "react";

import { Room, RoomType } from "types/rooms";
import { WorldEvent } from "types/venues";

import { VideoModal } from "components/organisms/VideoModal";

import { Modal } from "components/molecules/Modal";

import { PortalModalContent } from "./PortalModalContent";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./PortalModal.scss";

const emptyEvents: WorldEvent[] = [];

interface PortalModalProps {
  onHide: () => void;
  show: boolean;
  portal?: Room;
  venueEvents?: WorldEvent[];
  absolute?: boolean;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  onHide,
  portal,
  show,
  venueEvents = emptyEvents,
  absolute,
}) => {
  if (!portal) return null;

  if (portal.type === RoomType.modalFrame) {
    return (
      <VideoModal
        show={show}
        onHide={onHide}
        caption={portal.title}
        url={portal.url}
        autoplay
        backdrop
      />
    );
  }

  return (
    <Modal
      isOpen={show}
      onClose={onHide}
      className="PortalModal"
      isCentered
      overlayClose
      absolute={absolute}
    >
      <img
        className="PortalModal__close-icon"
        src={PortalCloseIcon}
        alt="close portal"
        onClick={onHide}
      />
      <PortalModalContent
        portal={portal}
        venueEvents={venueEvents}
        onHide={onHide}
      />
    </Modal>
  );
};
