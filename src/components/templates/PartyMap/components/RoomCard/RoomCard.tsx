import React from "react";

import { formatMinute, getCurrentEvent } from "utils/time";
import { RoomData } from "types/RoomData";

import { RoomAttendance } from "..";
import "./RoomCard.scss";

interface PropsType {
  startUtcSeconds: number;
  room: RoomData;
  attendance?: number;
  onClick: () => void;
}

export const RoomCard: React.FunctionComponent<PropsType> = ({
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
      <div className="room-attendance-container"></div>
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
