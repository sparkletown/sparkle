import React from "react";
import "./RoomCard.scss";
import RoomAttendance from "../RoomAttendance";
import { formatMinute } from "utils/time";
import { RoomData } from "types/RoomData";
import { getCurrentEvent } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
  room: RoomData;
  attendance?: number;
  onClick: () => void;
}

const RoomCard: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  room,
  attendance,
  onClick,
}) => {
  const currentEvent = room.events && getCurrentEvent(room, startUtcSeconds);
  const eventToDisplay =
    room.events &&
    room.events.length > 0 &&
    (currentEvent ? currentEvent : room.events[0]);

  return (
    <div
      className="room-card-container"
      onClick={onClick}
      id={`room-card-${room.title}`}
    >
      {room.image && (
        <img
          src={`/room-images/${room.image}`}
          className="room-img"
          alt={room.title}
        />
      )}
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
              {formatMinute(eventToDisplay.start_minute, startUtcSeconds)}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
