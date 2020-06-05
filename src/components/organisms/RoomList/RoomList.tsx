import React from "react";
import "./RoomList.scss";

import RoomCard, { Room } from "components/molecules/RoomCard";

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
          key={room.name}
          room={room}
          attendance={attendances[room.name]}
        />
      ))}
    </div>
  </>
);

export default RoomList;
