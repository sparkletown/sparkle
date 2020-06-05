import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal } from "react-bootstrap";

import { exitPreviewRoom, enterRoom, leaveRoom } from "actions";
import { formatHour } from "utils/time";
import RoomModalOngoingEvent from "components/molecules/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";

import "./RoomModal.scss";

export default function RoomModal({ show, onHide }) {
  const dispatch = useDispatch();
  const [inRoom, setInRoom] = useState();
  const { room, user, users } = useSelector((state) => ({
    room: state.room,
    user: state.user,
    users: state.firestore.ordered.users,
  }));

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
          <RoomModalOngoingEvent room={room} enterRoom={enter} />
        </div>
        <UserList users={users} />

        {room.events && room.events.length > 0 && (
          <div>
            Lineup:
            <ul>
              {room.events.map((event, idx) => (
                <li className="my-2" key={idx}>
                  <b>
                    {formatHour(event.start_hour)}-
                    {formatHour(event.start_hour + event.duration_hours)}:{" "}
                    {event.name}
                  </b>
                  <br />
                  Hosted by <b>{event.host}</b>
                  <br />
                  {event.text}
                  {event.interactivity && (
                    <Fragment>
                      <br />
                      Interactivity: {event.interactivity}
                    </Fragment>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
