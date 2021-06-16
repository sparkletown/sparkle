import React, { useState, useCallback, useMemo } from "react";

import { COVERT_ROOM_TYPES } from "settings";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import { isEventLiveOrFuture } from "utils/event";

import { useRecentVenueUsers } from "hooks/users";
import { useUser } from "hooks/useUser";
import { useVenueEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { Map, RoomModal } from "./components";

import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

import "./PartyMap.scss";

export interface PartyMapProps {
  venue: PartyMapVenue;
}

export const PartyMap: React.FC<PartyMapProps> = ({ venue }) => {
  const { user, profile } = useUser();
  const { recentVenueUsers } = useRecentVenueUsers();

  const { relatedVenues } = useRelatedVenues({ currentVenueId: venue.id });

  const childVenueIds = useMemo(
    () =>
      relatedVenues
        .filter(
          (relatedVenue) =>
            relatedVenue.parentId === venue.id || relatedVenue.id === venue.id
        )
        .map((childVenue) => childVenue.id),
    [relatedVenues, venue]
  );

  const { events: relatedVenueEvents } = useVenueEvents({
    venueIds: childVenueIds,
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const hasSelectedRoom = !!selectedRoom;

  const selectedRoomEvents = useMemo(() => {
    if (!relatedVenueEvents || !selectedRoom) return [];

    return relatedVenueEvents.filter(
      (event) => event.room === selectedRoom.title && isEventLiveOrFuture(event)
    );
  }, [relatedVenueEvents, selectedRoom]);

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
        roomEvents={selectedRoomEvents}
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
