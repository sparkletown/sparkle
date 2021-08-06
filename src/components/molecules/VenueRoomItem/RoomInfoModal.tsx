import React from "react";
import { Modal, Button } from "react-bootstrap";

import { VenueRoom } from "types/rooms";

import "./RoomInfoModal.scss";

interface VenueRoomItemInfoModalProps {
  onAdd: () => void;
  onHide: () => void;
  show: boolean;
  venueRoom: VenueRoom;
}

export const RoomInfoModal: React.FC<VenueRoomItemInfoModalProps> = ({
  onAdd,
  onHide,
  show,
  venueRoom: { description, poster, text },
}) => (
  <Modal
    centered
    dialogClassName="RoomInfoModal RoomInfoModal__dialog"
    onHide={onHide}
    show={show}
  >
    <Modal.Title className="RoomInfoModal__title">{text}</Modal.Title>
    <Modal.Body className="RoomInfoModal__body">
      {poster && (
        <img className="RoomInfoModal__poster" alt={text} src={poster} />
      )}

      <div className="RoomInfoModal__description">{description}</div>
    </Modal.Body>
    <Modal.Footer className="RoomInfoModal__footer">
      <Button
        className="RoomInfoModal__button-add"
        title="Add room"
        type="submit"
        onClick={() => onAdd()}
      >
        Add room
      </Button>
    </Modal.Footer>
  </Modal>
);
