import React from "react";
import { isRoomValid } from "validation";
import RoomAttendance from "../RoomAttendance";
import { PartyMapVenue, SubVenue } from "types/PartyMapVenue";

import "./Map.scss";
import { RoomData } from "types/RoomData";
import { WithId } from "utils/id";

interface PropsType {
  venue: PartyMapVenue;
  subVenues: Array<WithId<SubVenue>>;
  attendances: { [location: string]: number };
  setSelectedRoom: (venueId: string) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

const Map: React.FC<PropsType> = ({
  venue,
  subVenues,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  if (!venue) {
    return <>{`"Loading map..."`}</>;
  }

  const openRoomModal = (room: WithId<SubVenue>) => {
    setSelectedRoom(room.id);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div id="map" className="map-container">
        <div className="position-relative">
          <svg className="position-absolute" viewBox={venue.map_viewbox}>
            {/* {venue.rooms
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
              })} */}
          </svg>
          {subVenues
            .filter(isRoomValid)
            .filter((r) => r.on_map)
            .filter((r) => r.attendance_x && r.attendance_y)
            .map((room, idx) => (
              <RoomAttendance
                room={room}
                positioned={true}
                attendance={attendances[room.id]}
                key={idx}
                onClick={() => openRoomModal(room)}
              />
            ))}
          <img
            className="img-fluid map-image"
            src={venue.map_url}
            title="Clickable Map"
            alt="Clickable Map"
          />
        </div>
      </div>
    </>
  );
};

export default Map;
