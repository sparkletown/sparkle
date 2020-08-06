import React from "react";
import { isRoomValid } from "validation";
import RoomAttendance from "../RoomAttendance";

import "./Map.scss";

const Map = ({ config, attendances, setSelectedRoom }) => {
  if (!config) {
    return <>{`"Loading map..."`}</>;
  }

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
                    onClick={() => setSelectedRoom(room)}
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
                onClick={() => setSelectedRoom(room)}
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
