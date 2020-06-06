import React, { useState } from "react";
import "./RoomCard.scss";
import RoomAttendance from "RoomAttendance";
import { formatHour } from "utils/time";
import { Room } from "types/Room";
import { getCurrentEvent } from "utils/time";
import RoomModal from "components/organisms/RoomModal";
import { useDispatch } from "react-redux";
import { previewRoom } from "actions";

interface PropsType {
  startUtcSeconds: number;
  room: Room;
  attendance: any;
}

const RoomCard: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  room,
  attendance,
}) => {
  const currentEvent = room.events && getCurrentEvent(room, startUtcSeconds);
  const eventToDisplay =
    room.events && (currentEvent ? currentEvent : room.events[0]);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const preview = (room: Room) => {
    dispatch(previewRoom(room));
    setShowModal(true);
  };

  return (
    <>
      <div className="room-card-container" onClick={() => preview(room)}>
        <img
          src={`room-images/${room.image}`}
          className="room-img"
          alt={room.title}
        />
        <h4 className="room-title">{room.title}</h4>
        <RoomAttendance room={room} attendance={attendance} />
        {eventToDisplay && (
          <div className="artist-playing">
            <div className="event-name-container">
              <img
                className="sparkle-icon"
                alt="sparkles"
                src="/sparkle-icon.png"
              />
              <h5 className="event-name">{eventToDisplay.name}</h5>
            </div>
            {eventToDisplay.host && (
              <div>
                by <span className="host-name">{eventToDisplay.host}</span>
              </div>
            )}
            <div>
              <small>
                {formatHour(eventToDisplay.start_hour, startUtcSeconds)}
              </small>
            </div>
          </div>
        )}
      </div>
      <RoomModal
        startUtcSeconds={startUtcSeconds}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
};

export default RoomCard;
