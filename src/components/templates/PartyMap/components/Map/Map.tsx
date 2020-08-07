import React from "react";
import { isRoomValid } from "validation";
import RoomAttendance from "../RoomAttendance";
import { PartyMapVenue } from "types/PartyMapVenue";

import "./Map.scss";
import { RoomData } from "types/RoomData";

interface PropsType {
  config: PartyMapVenue;
  attendances: { [location: string]: number };
  setSelectedRoom: (room: RoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

const Map: React.FC<PropsType> = ({
  config,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  if (!config) {
    return <>{`"Loading map..."`}</>;
  }

  const openRoomModal = (room: RoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div id="map" className="map-container">
        <div className="position-relative">
          <svg className="position-absolute" viewBox={config.map_viewbox}>
            {config.rooms
              .filter(isRoomValid)
              .filter((r) => r.on_map)
              .map((room, idx) => {
                return (
                  <path
                    key={idx}
                    className="map-clickable-area"
                    onClick={() => openRoomModal(room)}
                    d={room.path}
                  >
                    <title>{room.title}</title>
                  </path>
                );
              })}
          </svg>
          {config.rooms
            .filter(isRoomValid)
            .filter((r) => r.on_map)
            .filter((r) => r.attendance_x && r.attendance_y)
            .map((room, idx) => (
              <RoomAttendance
                room={room}
                positioned={true}
                attendance={attendances[room.title]}
                key={idx}
                onClick={() => openRoomModal(room)}
              />
            ))}
          <img
            className="img-fluid map-image"
            src={config.map_url}
            title="Clickable Map"
            alt="Clickable Map"
          />
        </div>
      </div>
    </>
  );
};

export default Map;
