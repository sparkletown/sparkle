import React from "react";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { Modal } from "react-bootstrap";
import { AvatarGridRoom } from "types/AvatarGrid";
import "./RoomModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  room: AvatarGridRoom | undefined;
}

export const RoomModal: React.FC<PropsType> = ({ show, onHide, room }) => {
  const { user } = useUser();

  if (!room) {
    return <></>;
  }

  function enter() {
    room && user && enterRoom(user, room.name);
  }

  return (
    <Modal show={show} onHide={onHide}>
      <div className="room-container">
        <h4 className="room-name">{room.name}</h4>
        <div className="room-description">{room.description}</div>
        <div className="room-people"></div>
        <div className="room-button">
          {room.isFull ? (
            <button className="btn btn-disabled btn-block">
              Room is full - Come back later!
            </button>
          ) : (
            <a
              className="btn btn-active btn-block"
              href={room.url}
              onClick={enter}
            >
              Join the room
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
