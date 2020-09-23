import React from "react";
import { getCurrentEvent } from "utils/event";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
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
  const { users, venueEvents } = useSelector((state) => ({
    users: state.firestore.ordered.partygoers,
    venueEvents: state.firestore.ordered.venueEvents,
  }));

  if (!room) {
    return <></>;
  }

  // function enter() {
  //   room && user && enterRoom(user, room.name);
  // }

  // const roomEvents = venueEvents.filter((event) => event.room === room.name);
  // const currentEvent = roomEvents && getCurrentEvent(roomEvents);

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
            <a className="btn btn-active btn-block" href={room.url}>
              Join the room
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
