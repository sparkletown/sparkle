import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { RootState } from "index";
import { createUrlSafeName } from "api/admin";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { useRecentVenueUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { Map, RoomModal } from "./components";

import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./PartyMap.scss";

const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMap: React.FC = () => {
  useConnectCurrentVenue();
  const { user, profile } = useUser();
  const { recentVenueUsers } = useRecentVenueUsers();

  const currentVenue = useSelector(partyMapVenueSelector);

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const selectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
  }, []);

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  // Find current room from url
  const { roomTitle } = useParams();

  const currentRoom = useMemo(() => {
    if (!currentVenue || !currentVenue.rooms || !roomTitle) return;

    return currentVenue.rooms.find(
      (venueRoom) =>
        createUrlSafeName(venueRoom.title) === createUrlSafeName(roomTitle)
    );
  }, [currentVenue, roomTitle]);

  useEffect(() => {
    if (currentRoom) {
      selectRoom(currentRoom);
    }
  }, [currentRoom, selectRoom]);

  if (!user || !profile) return <>Loading..</>;

  return (
    <div className="party-venue-container">
      <Map
        user={user}
        profileData={profile.data}
        venue={currentVenue}
        partygoers={recentVenueUsers}
        selectRoom={selectRoom}
        unselectRoom={unselectRoom}
      />

      {selectedRoom && <RoomModal room={selectedRoom} onHide={unselectRoom} />}

      {currentVenue?.config?.showRangers && (
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp />
        </div>
      )}
    </div>
  );
};

export default PartyMap;
