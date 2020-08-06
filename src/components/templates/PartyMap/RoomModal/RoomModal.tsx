import React from "react";
import { getCurrentEvent } from "utils/time";
import RoomModalOngoingEvent from "components/templates/PartyMap/components/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import ScheduleItem from "components/templates/PartyMap/components/ScheduleItem";
import { enterRoom } from "utils/useLocationUpdateEffect";
import "./RoomModal.scss";
import { User } from "types/User";
import { User as FUser } from "firebase";
import { PartyMapVenue } from "types/PartyMapVenue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Modal } from "react-bootstrap";
import { RoomData } from "types/RoomData";

interface PropsType {
  show: boolean;
  onHide: () => void;
  room: RoomData | undefined;
}

const RoomModal: React.FC<PropsType> = ({ show, onHide, room }) => {
  const { user } = useUser();
  const { users, venue } = useSelector((state) => ({
    venue: state.firestore.ordered.currentVenue?.[0],
    users: state.firestore.ordered.partygoers,
  })) as { users: User[]; user: FUser; venue: PartyMapVenue };

  const usersToDisplay =
    users?.filter((user) => user.room === room?.title) ?? [];

  function enter() {
    room && user && enterRoom(user, room.title);
  }

  if (!room) return <></>;

  const currentEvent =
    room.events && getCurrentEvent(room, venue.start_utc_seconds);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="container room-container">
        <div className="room-description">
          <div className="title-container">
            <h2 className="room-modal-title">{room.title}</h2>
            <div className="room-modal-subtitle">{room.subtitle}</div>
            <div className="row ongoing-event-row">
              <div className="col">
                <img
                  src={`/room-images/${room.image}`}
                  className="room-page-image"
                  alt={room.title}
                />
              </div>
              <div className="col">
                <RoomModalOngoingEvent
                  room={room}
                  enterRoom={enter}
                  startUtcSeconds={venue.start_utc_seconds}
                />
              </div>
            </div>
          </div>
        </div>
        <UserList users={usersToDisplay} limit={11} activity="in this room" />
        {room.about && <div className="about-this-room">{room.about}</div>}
        <div className="row">
          {room.events && room.events.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {room.events.map((event, idx: number) => (
                <ScheduleItem
                  key={idx}
                  startUtcSeconds={venue.start_utc_seconds}
                  event={event}
                  isCurrentEvent={
                    currentEvent && event.name === currentEvent.name
                  }
                  enterRoom={enter}
                  roomUrl={room.external_url}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;
