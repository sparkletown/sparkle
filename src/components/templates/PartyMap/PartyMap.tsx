import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { RootState } from "index";
import { createUrlSafeName } from "api/admin";

import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";

import { useCampPartygoers } from "hooks/useCampPartygoers";
import { useSelector } from "hooks/useSelector";

import { Map } from "./components/Map";
import { RoomModal } from "./components/RoomModal";

import "./PartyMap.scss";

const campVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as CampVenue;

export const PartyMap: React.FC = () => {
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<CampRoomData | undefined>();

  const venue = useSelector(campVenueSelector);
  const usersInCamp = useCampPartygoers(venue.name);

  const attendances = usersInCamp
    ? usersInCamp.reduce<Record<string, number>>((acc, value) => {
        Object.keys(value.lastSeenIn).forEach((key) => {
          acc[key] = (acc[key] || 0) + 1;
        });
        return acc;
      }, {})
    : {};

  const modalHidden = useCallback(() => {
    setIsRoomModalOpen(false);
  }, []);

  const { roomTitle } = useParams();

  useEffect(() => {
    if (roomTitle) {
      const campRoom = venue?.rooms.find(
        (room) => createUrlSafeName(room.title) === createUrlSafeName(roomTitle)
      );
      if (campRoom) {
        setSelectedRoom(campRoom);
        setIsRoomModalOpen(true);
      }
    }
  }, [roomTitle, setIsRoomModalOpen, setSelectedRoom, venue]);

  return (
    <>
      <div className="camp-container">
        <Map
          venue={venue}
          attendances={attendances}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
        />
        <RoomModal
          show={isRoomModalOpen}
          room={selectedRoom}
          onHide={modalHidden}
          joinButtonText={venue.joinButtonText}
        />
      </div>
    </>
  );
};

export default PartyMap;
