import React, { useState, useCallback } from "react";

import { RootState } from "index";

import { Room, RoomTypes } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { useRecentVenueUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { Map, RoomModal } from "./components";

import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./PartyMap.scss";
import { useCustomSound } from "hooks/sounds";

const partyMapVenueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue?.[0] as PartyMapVenue;

export const PartyMap: React.FC = () => {
  useConnectCurrentVenue();
  const { user, profile } = useUser();
  const { recentVenueUsers } = useRecentVenueUsers();
  const { isLoaded: isCustomSoundsLoaded } = useCustomSound();

  const currentVenue = useSelector(partyMapVenueSelector);

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const hasSelectedRoom = !!selectedRoom;

  const selectRoom = useCallback((room: Room) => {
    if (room.type === RoomTypes.unclickable) return;

    setSelectedRoom(room);
  }, []);

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  if (!user || !profile || !isCustomSoundsLoaded) return <>Loading..</>;

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

      <RoomModal
        room={selectedRoom}
        venue={currentVenue}
        show={hasSelectedRoom}
        onHide={unselectRoom}
      />

      {currentVenue?.config?.showRangers && (
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp />
        </div>
      )}
    </div>
  );
};

export default PartyMap;
