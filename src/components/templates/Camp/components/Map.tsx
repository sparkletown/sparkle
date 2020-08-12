import React from "react";
import { CampVenue } from "types/CampVenue";
import { CampRoomData } from "types/CampRoomData";
import { RoomAttendance } from "./RoomAttendance";
import { isRoomValid } from "validation";

import "./Map.scss";

interface PropsType {
  venue: CampVenue;
  attendances: { [location: string]: number };
  setSelectedRoom: (room: CampRoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const Map: React.FC<PropsType> = ({
  venue,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  if (!venue) {
    return <>Loading map...</>;
  }

  const openRoomModal = (room: CampRoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div id="map" className="map-container">
        {venue.rooms.filter(isRoomValid).map((room, idx) => (
          <>
            <div
              className="room position-relative"
              style={{
                left: room.x_percent + "%",
                top: room.y_percent + "%",
                width: room.width_percent + "%",
                height: room.height_percent + "%",
              }}
              key={idx}
              onClick={() => openRoomModal(room)}
            >
              <img
                className="img-fluid"
                src={room.image_url}
                onClick={() => openRoomModal(room)}
                title={room.title}
                alt={room.title}
              />
              <RoomAttendance
                roomTitle={room.title}
                attendance={attendances[room.title]}
                key={idx}
                onClick={() => openRoomModal(room)}
              />
            </div>
          </>
        ))}
        <img
          className="img-fluid map-image"
          src={venue.map_url}
          title="Clickable Map"
          alt="Clickable Map"
        />
      </div>
    </>
  );
};
