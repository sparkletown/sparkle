import React from "react";
import { isRoomValid } from "validation";
import RoomAttendance from "../RoomAttendance";

import "./Map.scss";
import { useHistory, useRouteMatch } from "react-router-dom";

export default function Map({ config, attendances }) {
  const history = useHistory();

  const { url: baseUrl } = useRouteMatch();

  if (!config) {
    return <>"Loading map..."</>;
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
                    href={
                      room.url ? `${baseUrl}${room.url}` : room.external_url
                    }
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
                attendance={attendances[room.title]}
                key={idx}
                onClick={() =>
                  history.push(
                    room.url ? `${baseUrl}${room.url}` : room.external_url
                  )
                }
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
}
