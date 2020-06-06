import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";

import { formatHour } from "utils/time";
import { isRoomValid } from "./validation";
import { previewRoom } from "./actions";

import RoomModal from "components/organisms/RoomModal";
import RoomAttendance from "./RoomAttendance";

const ONE_HOUR_IN_SECONDS = 60 * 60;

export default function Rooms(props) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState();

  function preview(room) {
    dispatch(previewRoom(room));
    setShowModal(true);
  }

  if (!rooms) {
    return "Loading experiences & schedule...";
  }

  const rooms = props.rooms
    .filter(isRoomValid)
    .filter((r) => r.on_list)
    .concat()
    .sort((a, b) => a.order - b.order);

  function notEnded(event) {
    const start =
      props.startUtcSeconds + event.start_hour * ONE_HOUR_IN_SECONDS;
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
                  {room.title}
                </button>
                <RoomAttendance
                  room={room}
                  attendance={props.attendances[room.title]}
                />
              </div>
              <div className="ml-3">
                {room.title}
                {room.events && room.events.filter(notEnded).length > 0 && (
                  <ul>
                    {room.events.filter(notEnded).map((event, idx) => (
                      <li className="my-2" key={idx}>
                        <b>
                          {formatHour(event.start_hour, props.startUtcSeconds)}-
                          {formatHour(
                            event.start_hour + event.duration_hours,
                            props.startUtcSeconds
                          )}
                          : {event.name}
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
      <RoomModal
        startUtcSeconds={props.startUtcSeconds}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </Fragment>
  );
}
