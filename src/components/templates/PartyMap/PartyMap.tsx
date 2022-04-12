import React, { useCallback, useMemo, useState } from "react";

import { COVERT_ROOM_TYPES } from "settings";

import { PartyMapSpaceWithId, SpaceId } from "types/id";
import { Room } from "types/rooms";

import {
  eventsByStartUtcSecondsSorter,
  isEventLiveOrFuture,
} from "utils/event";

import { useSpaceEvents } from "hooks/events";
import { useLiveUser } from "hooks/user/useLiveUser";

import { Map } from "components/templates/PartyMap/components/Map";
import { PortalModal } from "components/templates/PartyMap/components/PortalModal";

import styles from "./PartyMap.module.scss";

interface PartyMapProps {
  venue: PartyMapSpaceWithId;
}

export const PartyMap: React.FC<PartyMapProps> = ({ venue }) => {
  const { user, profile } = useLiveUser();

  const selfAndPortalSpaceIds = useMemo(() => {
    const spaceIds = (venue?.rooms ?? [])
      .map((portal) => portal.spaceId)
      .filter((spaceId) => !!spaceId) as SpaceId[];
    return [venue?.id].concat(spaceIds);
  }, [venue]);

  const { events: selfAndChildVenueEvents } = useSpaceEvents({
    worldId: venue.worldId,
    spaceIds: selfAndPortalSpaceIds,
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  const hasSelectedRoom = !!selectedRoom;

  const selectedRoomEvents = useMemo(() => {
    if (!selfAndChildVenueEvents || !selectedRoom) return [];

    return selfAndChildVenueEvents
      .filter(
        (event) =>
          event.spaceId === selectedRoom.spaceId && isEventLiveOrFuture(event)
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
    <div
      data-bem="PartyMap"
      data-block="PartyMap"
      data-side="att"
      className={styles.PartyMap}
    >
      <Map user={user} venue={venue} selectRoom={selectRoom} />

      <PortalModal
        portal={selectedRoom}
        venueEvents={selectedRoomEvents}
        show={hasSelectedRoom}
        onHide={unselectRoom}
      />
    </div>
  );
};
