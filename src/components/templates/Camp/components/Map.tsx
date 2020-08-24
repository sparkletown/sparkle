import React, { useState } from "react";
import { CampVenue } from "types/CampVenue";
import { CampRoomData } from "types/CampRoomData";

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
  const [roomClicked, setRoomClicked] = useState<string | undefined>(undefined);

  if (!venue) {
    return <>Loading map...</>;
  }

  const rooms = [...venue.rooms];
  if (roomClicked) {
    const idx = rooms.findIndex((room) => room.title === roomClicked);
    if (idx !== -1) {
      const chosenRoom = rooms.splice(idx, 1);
      rooms.push(chosenRoom[0]);
    }
  }

  const getRoomUrl = (roomUrl: string) => {
    return roomUrl.includes("http") ? roomUrl : "//" + roomUrl;
  };

  return (
    <>
      <div id="map" className="map-container">
        {rooms.map((room, idx) => (
          <div
            className="room position-absolute"
            style={{
              left: room.x_percent + "%",
              top: room.y_percent + "%",
              width: room.width_percent + "%",
              height: room.height_percent + "%",
            }}
            key={room.title}
            onClick={() => {
              setRoomClicked((prevRoomClicked) =>
                prevRoomClicked === room.title ? undefined : room.title
              );
            }}
          >
            <div
              className={`playa-venue ${
                roomClicked === room.title ? "clicked" : ""
              }`}
            >
              <div className="playa-venue-img">
                <img src={room.image_url} title={room.title} alt={room.title} />
              </div>
              <div className="playa-venue-text">
                <div className="playa-venue-maininfo">
                  <div className="playa-venue-title">{room.title}</div>
                  <div className="playa-venue-people">
                    {attendances[room.title] ?? 0}
                  </div>
                </div>
                <div className="playa-venue-secondinfo">
                  <div className="playa-venue-desc">
                    <p>{room.subtitle}</p>
                    <p>{room.about}</p>
                  </div>
                  <div className="playa-venue-actions">
                    <a
                      className="btn btn-block btn-small btn-primary"
                      href={getRoomUrl(room.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join the room
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <img
          className="img-fluid map-image"
          src={venue.mapBackgroundImageUrl}
          title="Clickable Map"
          alt="Clickable Map"
        />
      </div>
    </>
  );
};
