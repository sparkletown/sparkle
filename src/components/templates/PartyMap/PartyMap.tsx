import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { RootState } from "index";
import { createUrlSafeName } from "api/admin";

import { PartyMapRoomData } from "types/PartyMapRoomData";
import { PartyMapVenue } from "types/PartyMapVenue";

import { useCampPartygoers } from "hooks/useUsers";
import { useSelector } from "hooks/useSelector";

import { Map, RoomModal, CanvasMap } from "./components";

import "./PartyMap.scss";
import AnnouncementMessage from "components/molecules/AnnouncementMessage/AnnouncementMessage";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { useUser } from "hooks/useUser";

const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMap: React.FC = () => {
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<
    PartyMapRoomData | undefined
  >();

  const venue = useSelector(partyMapVenueSelector);
  const usersInCamp = useCampPartygoers(venue.name);
  const { userWithId, profile } = useUser();

  const attendances = useMemo(
    () =>
      usersInCamp
        ? usersInCamp.reduce<Record<string, number>>((acc, value) => {
            Object.keys(value.lastSeenIn).forEach((key) => {
              acc[key] = (acc[key] || 0) + 1;
            });
            return acc;
          }, {})
        : {},
    [usersInCamp]
  );

  const modalHidden = useCallback(() => {
    setIsRoomModalOpen(false);
  }, []);

  const { roomTitle } = useParams();

  useEffect(() => {
    if (roomTitle) {
      const partyRoom = venue?.rooms?.find(
        (room) => createUrlSafeName(room.title) === createUrlSafeName(roomTitle)
      );
      if (partyRoom) {
        setSelectedRoom(partyRoom);
        setIsRoomModalOpen(true);
      }
    }
  }, [roomTitle, setIsRoomModalOpen, setSelectedRoom, venue]);

  if (!userWithId || !profile || !venue) return <>Loading...</>;

  return (
    <>
      <div className="party-venue-container">
        <CanvasMap
          venue={venue}
          user={userWithId}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
        ></CanvasMap>
        {/* <Map
          venue={venue}
          attendances={attendances}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsRoomModalOpen={setIsRoomModalOpen}
        /> */}
        <RoomModal
          show={isRoomModalOpen}
          room={selectedRoom}
          onHide={modalHidden}
        />
        <AnnouncementMessage message={venue.bannerMessage} />
        {venue?.showRangers && (
          <div className="sparkle-fairies">
            <SparkleFairiesPopUp />
          </div>
        )}
      </div>
    </>
  );
};

export default PartyMap;
