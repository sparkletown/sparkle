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
      className="card card_room"
      onClick={onClick}
      id={`room-card-${room.title}`}
    >
      <div className="card-animation card-animation_music">
        <span className="icon-1"></span>
        <span className="icon-2"></span>
        <span className="icon-3"></span>
      </div>
      {room.image && (
        <img
          src={`/room-images/${room.image}`}
          className="card_room-pic"
          alt={room.title}
        />
      )}
      <h5 className="italic">{room.title}</h5>
      <div className="room-attendance-container">
        <RoomAttendance room={room} attendance={attendance} />
      </div>
      <div className="card_room-now">
        <h6 className="primary">{eventToDisplay.name}</h6>
        <p className="small primary">by {eventToDisplay.host}</p>
        <p className="small primary">
          {formatMinute(eventToDisplay.start_minute, startUtcSeconds)}
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
