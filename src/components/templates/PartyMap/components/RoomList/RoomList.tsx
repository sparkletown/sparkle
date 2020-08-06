import React from "react";
import "./RoomList.scss";

import { RoomData } from "types/RoomData";
import RoomCard from "../RoomCard";
import { eventHappeningNow } from "utils/time";

interface PropsType {
  startUtcSeconds: number;
  rooms: RoomData[];
  attendances: Record<string, number>;
  setSelectedRoom: (value: RoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

const RoomList: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  rooms,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  rooms = rooms.filter(
    (room) => room.on_list && eventHappeningNow(room, startUtcSeconds)
  );

  const openModal = (room: RoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div className="room-list-title">
        {`What's on now: ${rooms.length} rooms open`}
      </div>
      <div className="rooms-container">
        {rooms.map((room) => (
          <RoomCard
            key={room.title}
            startUtcSeconds={startUtcSeconds}
            room={room}
            attendance={attendances[room.title]}
            onClick={() => openModal(room)}
          />
        ))}
      </div>
    </>
  );
};

export default RoomList;
