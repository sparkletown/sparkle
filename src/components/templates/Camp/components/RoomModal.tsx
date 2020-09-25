import React from "react";
import { getCurrentEvent } from "utils/event";
import { RoomModalOngoingEvent } from "./RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import { ScheduleItem } from "./ScheduleItem";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Modal } from "react-bootstrap";
import { CampRoomData } from "types/CampRoomData";

import "../../../templates/PartyMap/RoomModal/RoomModal.scss";

interface PropsType {
  show: boolean;
  onHide: () => void;
  room: CampRoomData | undefined;
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

  const usersToDisplay =
    users?.filter((user) => user.room === room?.title) ?? [];

  function enter() {
    room && user && enterRoom(user, room.title);
  }

  const roomEvents =
    venueEvents && venueEvents.filter((event) => event.room === room.title);
  const currentEvent = roomEvents && getCurrentEvent(roomEvents);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="container room-container">
        <div className="room-description">
          <div className="title-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                marginTop: 10,
              }}
            >
              <h2 className="room-modal-title">{room.title}</h2>
              <div className="room-modal-subtitle">{room.subtitle}</div>
            </div>
            <div className="row ongoing-event-row">
              <div className="col">
                {room.image_url && (
                  <img
                    src={room.image_url}
                    className="room-page-image"
                    alt={room.title}
                  />
                )}
                {!room.image_url && room.title}
              </div>
              <div className="col">
                <RoomModalOngoingEvent
                  room={room}
                  roomEvents={roomEvents}
                  enterRoom={enter}
                />
              </div>
            </div>
          </div>
        </div>
        <UserList users={usersToDisplay} limit={11} activity="in this room" />
        {room.about && <div className="about-this-room">{room.about}</div>}
        <div className="row">
          {roomEvents && roomEvents.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {roomEvents.map((event, idx: number) => (
                <ScheduleItem
                  key={idx}
                  event={event}
                  isCurrentEvent={
                    currentEvent && event.name === currentEvent.name
                  }
                  enterRoom={enter}
                  roomUrl={room.url}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
