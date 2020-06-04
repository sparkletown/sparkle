import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Modal } from "react-bootstrap";

import { exitPreviewRoom, enterRoom, leaveRoom } from "./actions";
import { formatHour } from "utils/time";

export default function RoomModal({ show, onHide }) {
  const dispatch = useDispatch();
  const [inRoom, setInRoom] = useState();
  const { room, user } = useSelector((state) => ({
    room: state.room,
    user: state.user,
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
      <Modal.Header closeButton>
        <Modal.Title>Welcome to {room.name}!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {room.title}
          <a
            type="button"
            className="btn btn-success float-right"
            onClick={() => enter()}
            href={room.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Jump in!
          </a>
        </div>
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
      <Modal.Footer>
        <a
          type="button"
          className="btn btn-success"
          onClick={() => enter()}
          href={room.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Jump in!
        </a>
      </Modal.Footer>
    </Modal>
  );
}
