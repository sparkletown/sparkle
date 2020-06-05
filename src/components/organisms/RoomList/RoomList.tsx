import React from "react";
import "./RoomList.scss";

import { Room } from "types/Room";
import RoomCard from "components/molecules/RoomCard";

interface PropsType {
  rooms: Room[];
  attendances: any;
}

const RoomList: React.FunctionComponent<PropsType> = ({
  rooms,
  attendances,
}) => (
  <>
    <div className="room-list-title">
      What's on now: {rooms.length} rooms open
    </div>
    <div className="rooms-container">
      {rooms.map((room) => (
        <RoomCard
          key={room.title}
          room={room}
          attendance={attendances[room.title]}
        />
      ))}
    </div>
  </>
);

export default RoomList;
