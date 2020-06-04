import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";

import { PARTY_START_UTC_SECONDS, ONE_HOUR_IN_SECONDS } from "./config";
import { formatHour } from "utils/time";
import { isRoomValid } from "./validation";
import { previewRoom } from "./actions";

import RoomModal from "./RoomModal";
import RoomAttendance from "./RoomAttendance";

export default function Rooms(props) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState();

  function preview(room) {
    dispatch(previewRoom(room));
    setShowModal(true);
  }

  if (props.rooms === undefined) {
    return "Loading experiences & schedule...";
  }

  const rooms = props.rooms
    .filter(isRoomValid)
    .filter((r) => r.on_list)
    .concat()
    .sort((a, b) => a.order - b.order);

  function notEnded(event) {
    const start =
      PARTY_START_UTC_SECONDS + event.start_hour * ONE_HOUR_IN_SECONDS;
    const end = start + event.duration_hours * ONE_HOUR_IN_SECONDS;
    const notEnded = end >= props.time;
    return notEnded;
  }

  return (
    <Fragment>
      <div className="card" id="experiences">
        <div className="card-header">Upcoming & Current Experiences:</div>
        <ul className="list-group">
          {rooms.map((room, idx) => (
            <li
              className="list-group-item"
              onClick={() => preview(room)}
              key={idx}
            >
              <div className="d-flex">
                <button
                  className="btn btn-link stretched-link"
                  title={room.title}
                >
                  {room.name}
                </button>
                <RoomAttendance
                  room={room}
                  attendance={props.attendances[room.name]}
                />
              </div>
              <div className="ml-3">
                {room.title}
                {room.events && room.events.filter(notEnded).length > 0 && (
                  <ul>
                    {room.events.filter(notEnded).map((event, idx) => (
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
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <RoomModal show={showModal} onHide={() => setShowModal(false)} />
    </Fragment>
  );
}
