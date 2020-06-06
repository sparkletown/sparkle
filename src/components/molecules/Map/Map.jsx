import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { isRoomValid } from "validation";
import { previewRoom } from "actions";

import RoomModal from "components/organisms/RoomModal";
import RoomAttendance from "RoomAttendance";

import "./Map.scss";

export default function Map({ config, attendances }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState();

  function preview(room) {
    dispatch(previewRoom(room));
    setShowModal(true);
  }

  if (!config) {
    return "Loading map...";
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
                const color = "#ffffff33";
                return (
                  <a
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      preview(room);
                    }}
                    href="/"
                  >
                    <path d={room.path} style={{ fill: color }}>
                      <title>{room.title}</title>
                    </path>
                  </a>
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
                attendance={attendances[room.name]}
                key={idx}
                onClick={() => preview(room)}
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
      <RoomModal
        startUtcSeconds={config.start_utc_seconds}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
}
