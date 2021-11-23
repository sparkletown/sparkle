import React, { useCallback, useMemo, useState } from "react";

import { COVERT_ROOM_TYPES } from "settings";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import {
  eventsByStartUtcSecondsSorter,
  isEventLiveOrFuture,
} from "utils/event";

import { useVenueEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

import { Map, PortalModal } from "./components";

import "./PartyMap.scss";

export interface PartyMapProps {
  venue: PartyMapVenue;
}

export const PartyMap: React.FC<PartyMapProps> = ({ venue }) => {
  const { user, profile } = useUser();

  const { relatedVenues } = useRelatedVenues();

  const selfAndChildVenueIds = useMemo(
    () =>
      relatedVenues
        .filter(
          (relatedVenue) =>
            relatedVenue.parentId === venue.id || relatedVenue.id === venue.id
        )
        .map((childVenue) => childVenue.id),
    [relatedVenues, venue]
  );

  const { events: selfAndChildVenueEvents } = useVenueEvents({
    venueIds: selfAndChildVenueIds,
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const hasSelectedRoom = !!selectedRoom;

  const selectedRoomEvents = useMemo(() => {
    if (!selfAndChildVenueEvents || !selectedRoom) return [];

    return selfAndChildVenueEvents
      .filter(
        (event) =>
          event.room === selectedRoom.title && isEventLiveOrFuture(event)
      )
      .sort(eventsByStartUtcSecondsSorter);
  }, [selfAndChildVenueEvents, selectedRoom]);

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
      <Map user={user} venue={venue} selectRoom={selectRoom} />

      <PortalModal
        portal={selectedRoom}
        venue={venue}
        venueEvents={selectedRoomEvents}
        show={hasSelectedRoom}
        onHide={unselectRoom}
      />
    </div>
  );
};
