import React from "react";

import { CampRoomData } from "types/CampRoomData";
import RoomCard from "./RoomCard";

import "../../../templates/PartyMap/components/RoomList/RoomList.scss";
import { useSelector } from "hooks/useSelector";
import { currentVenueSelector } from "utils/selectors";

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
  const venue = useSelector(currentVenueSelector);

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
            attendance={
              (attendances[`${venue?.name} / ${room?.title}`] ?? 0) +
              (room.attendanceBoost ?? 0)
            }
            onClick={() => openModal(room)}
          />
        ))}
      </div>
    </>
  );
};
