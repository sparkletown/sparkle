import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal } from "react-bootstrap";

import { exitPreviewRoom, enterRoom, leaveRoom } from "actions";
import { getCurrentEvent } from "utils/time";

import RoomModalOngoingEvent from "components/molecules/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import ScheduleItem from "components/molecules/ScheduleItem";

import "./RoomModal.scss";

export default function RoomModal({ startUtcSeconds, show, onHide }) {
  const dispatch = useDispatch();
  const [inRoom, setInRoom] = useState();
  const { room, user, users } = useSelector((state) => ({
    room: state.room,
    user: state.user,
    users: state.firestore.ordered.users,
  }));

  const usersToDisplay =
    users?.filter((user) => user.room === room?.title) ?? [];

  useEffect(() => {
    const previousonfocus = window.onfocus;
    window.onfocus = () => {
      if (inRoom) {
        dispatch(leaveRoom(user.uid));
      }
    };
    const previousonblur = window.onblur;
    window.onblur = () => {
      if (inRoom) {
        dispatch(enterRoom(room, user.uid));
      }
    };
    return () => {
      window.onfocus = previousonfocus;
      window.onblur = previousonblur;
    };
  });

  if (!room || !user) {
    return null;
  }

  function enter() {
    setInRoom(true);
    dispatch(enterRoom(room, user.uid));
  }

  const leave = () => {
    dispatch(exitPreviewRoom(user.uid));
  };

  const currentEvent = room.events && getCurrentEvent(room, startUtcSeconds);

  return (
    <Modal show={show} onHide={onHide} onExited={leave}>
      <Modal.Body>
        <div className="room-description">
          <div className="title-container">
            <h2 className="room-modal-title">{room.title}</h2>
            <div className="room-modal-subtitle">{room.subtitle}</div>
            <img
              src={`room-images/${room.image}`}
              className="room-modal-image"
              alt={room.title}
            />
          </div>
          <RoomModalOngoingEvent
            room={room}
            enterRoom={enter}
            startUtcSeconds={startUtcSeconds}
          />
        </div>
        <UserList users={usersToDisplay} limit={20} />
        {room.about && <div className="about-this-room">{room.about}</div>}
        {room.events && room.events.length > 0 && (
          <div className="schedule-container">
            <div className="schedule-title">Room Schedule</div>
            {room.events.map((event, idx) => (
              <ScheduleItem
                key={idx}
                startUtcSeconds={startUtcSeconds}
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
      </Modal.Body>
    </Modal>
  );
}
