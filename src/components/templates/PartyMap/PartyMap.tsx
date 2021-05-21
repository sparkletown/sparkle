import React, { useState, useCallback } from "react";

import { COVERT_ROOM_TYPES } from "settings";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { useRecentVenueUsers } from "hooks/users";
import { useUser } from "hooks/useUser";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";

import { Map, RoomModal } from "./components";

import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./PartyMap.scss";

export interface PartyMapProps {
  venue: PartyMapVenue;
}

export const PartyMap: React.FC<PartyMapProps> = ({ venue }) => {
  // @debt can we remove useConnectCurrentVenue here? Do any descendants need it?
  useConnectCurrentVenue();

  const { user, profile } = useUser();
  const { recentVenueUsers } = useRecentVenueUsers();

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const hasSelectedRoom = !!selectedRoom;

  const selectRoom = useCallback((room: Room) => {
    if (room.type && COVERT_ROOM_TYPES.includes(room.type)) return;

    setSelectedRoom(room);
  }, []);

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  if (!user || !profile) return <>Loading..</>;

  return (
    <div className="party-venue-container">
      <Map
        user={user}
        profileData={profile.data}
        venue={venue}
        partygoers={recentVenueUsers}
        selectRoom={selectRoom}
        unselectRoom={unselectRoom}
      />

      <RoomModal
        room={selectedRoom}
        venue={venue}
        show={hasSelectedRoom}
        onHide={unselectRoom}
      />

      {venue.config?.showRangers && (
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp />
        </div>
      )}
    </div>
  );
};
