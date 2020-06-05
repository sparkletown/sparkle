import React from "react";
import "./RoomCard.scss";
import RoomAttendance from "RoomAttendance";
import { formatHour } from "utils/time";

interface Event {
  start_hour: number;
  duration_hours: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
}

export interface Room {
  name: string;
  title: string;
  on_list: boolean;
  on_map: boolean;
  image: string;
  url: string;
  path: string;
  events?: Event[];
}

interface PropsType {
  room: Room;
  attendance: any;
}

const RoomCard: React.FunctionComponent<PropsType> = ({ room, attendance }) => {
  console.log(room);
  return (
    <div className="room-card-container">
      <img
        src={`room-images/${room.image}`}
        className="room-img"
        alt={room.name}
      />
      <h4 className="room-title">{room.name}</h4>
      <RoomAttendance room={room} attendance={attendance} />
      {room.events && (
        <div className="artist-playing">
          <div className="event-name-container">
            <img
              className="sparkle-icon"
              alt="sparkles"
              src="/sparkle-icon.png"
            />
            <h5 className="event-name">{room.events[0].name}</h5>
          </div>
          {room.events[0].host && (
            <div>
              by <span className="host-name">{room.events[0].host}</span>
            </div>
          )}
          <div>
            <small>{formatHour(room.events[0].start_hour)}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
