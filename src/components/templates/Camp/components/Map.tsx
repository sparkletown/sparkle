import React, { useState } from "react";
import { CampVenue } from "types/CampVenue";
import { CampRoomData } from "types/CampRoomData";
//import { RoomAttendance } from "./RoomAttendance";

import "./Map.scss";
//import { reduce } from "lodash";

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
  // const openRoomModal = useCallback(
  //   (room: CampRoomData) => {
  //     setSelectedRoom(room);
  //     setIsRoomModalOpen(true);
  //   },
  //   [setSelectedRoom, setIsRoomModalOpen]
  // );
  // const [index, setIndex] = useState(-1)
  const [clicked, setClicked] = useState(false);

  if (!venue) {
    return <>Loading map...</>;
  }

  const rooms = venue.rooms;

  // if (index !== -1) {
  //   console.log(rooms)
  //   console.log(index)
  //   const chosenRoom = rooms.splice(0, 1)
  //   console.log(chosenRoom)
  //   rooms = [...rooms, chosenRoom[0]]
  // }

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
            key={idx}
            onClick={() => {
              setClicked((prev) => !prev);
            }}
          >
            <div className={`playa-venue ${clicked ? "clicked" : ""}`}>
              <div className="playa-venue-img">
                <img src={room.image_url} title={room.title} alt={room.title} />
              </div>
              <div className="playa-venue-text">
                <div className="playa-venue-maininfo">
                  <div className="playa-venue-title">{room.title}</div>
                  <div className="playa-venue-people">22</div>
                </div>
                <div className="playa-venue-secondinfo">
                  <div className="playa-venue-desc">
                    <p>{room.subtitle}</p>
                    <p>{room.about}</p>
                  </div>
                  <div className="playa-venue-actions">
                    <a href="#" className="btn btn-block btn-small btn-info">
                      &#9432;
                    </a>
                    <a
                      className="btn btn-block btn-small btn-primary"
                      href={
                        room.url.includes("http") ? room.url : "//" + room.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join the room
                    </a>

                    {/* <a href="#" className="btn btn-block btn-small btn-primary">Join the Room</a> */}
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
