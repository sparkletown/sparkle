import React from "react";

import { eventHappeningNow } from "utils/time";
import { RoomData } from "types/RoomData";

import { RoomCard } from "..";
import "./RoomList.scss";

interface PropsType {
  startUtcSeconds: number;
  rooms: RoomData[];
  attendances: Record<string, number>;
  setSelectedRoom: (value: RoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const RoomList: React.FunctionComponent<PropsType> = ({
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
      <div>
        <h5>{`What's on now: ${rooms.length} rooms open`}</h5>
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
