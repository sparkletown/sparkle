import React from "react";

import { CampRoomData } from "types/CampRoomData";
import RoomCard from "./RoomCard";

import "../../../templates/PartyMap/components/RoomList/RoomList.scss";

interface PropsType {
  rooms: CampRoomData[];
  attendances: Record<string, number>;
  setSelectedRoom: (value: CampRoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const RoomList: React.FunctionComponent<PropsType> = ({
  rooms,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const openModal = (room: CampRoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div className="rooms-container">
        {rooms.map((room) => (
          <RoomCard
            key={room.title}
            room={room}
            attendance={attendances[room.title] + (room.attendanceBoost ?? 0)}
            onClick={() => openModal(room)}
          />
        ))}
      </div>
    </>
  );
};
