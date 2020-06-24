import React from "react";
import "./RoomList.scss";

import { Room } from "types/Room";
import RoomCard from "components/molecules/RoomCard";
import { eventHappeningNow } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
  rooms: Room[];
  attendances: any;
}

const RoomList: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  rooms,
  attendances,
}) => {
  rooms = rooms.filter(
    (room) => room.on_list && eventHappeningNow(room, startUtcSeconds)
  );

  return (
    <>
      <div className="room-list-title">
        What's on now: {rooms.length} rooms open
      </div>
      <div className="rooms-container">
        {rooms.map((room) => (
          <RoomCard
            key={room.title}
            startUtcSeconds={startUtcSeconds}
            room={room}
            attendance={attendances[room.title]}
          />
        ))}
      </div>
    </>
  );
};

export default RoomList;
