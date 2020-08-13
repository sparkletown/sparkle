import React from "react";

import { CampRoomData } from "types/CampRoomData";
import RoomCard from "./RoomCard";
import { eventHappeningNow } from "utils/event";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";

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
  useConnectCurrentVenue();

  const { events } = useSelector((state) => ({
    events: state.firestore.ordered.venueEvents,
  }));

  const currentRooms = rooms.filter((room) =>
    eventHappeningNow(room.title, events)
  );

  const openModal = (room: CampRoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div>
        <h5>{`What's on now: ${currentRooms.length} rooms open`}</h5>
      </div>
      <div className="rooms-container">
        {currentRooms.map((room) => (
          <RoomCard
            key={room.title}
            room={room}
            attendance={attendances[room.title]}
            onClick={() => openModal(room)}
          />
        ))}
      </div>
    </>
  );
};
