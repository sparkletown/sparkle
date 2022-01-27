import React from "react";
import { Modal } from "react-bootstrap";

import { Room, RoomType } from "types/rooms";
import { WorldEvent } from "types/venues";

import { VideoModal } from "components/organisms/VideoModal";

import { PortalModalContent } from "./PortalModalContent";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./PortalModal.scss";

const emptyEvents: WorldEvent[] = [];

interface PortalModalProps {
  onHide: () => void;
  show: boolean;
  portal?: Room;
  venueEvents?: WorldEvent[];
}

export const PortalModal: React.FC<PortalModalProps> = ({
  onHide,
  portal,
  show,
  venueEvents = emptyEvents,
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
    <Modal show={show} onHide={onHide} className="PortalModal" centered>
      <Modal.Body className="PortalModal__modal-body">
        <PortalModalContent
          portal={portal}
          venueEvents={venueEvents}
          onHide={onHide}
        />

        <img
          className="PortalModal__close-icon"
          src={PortalCloseIcon}
          alt="close portal"
          onClick={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};
