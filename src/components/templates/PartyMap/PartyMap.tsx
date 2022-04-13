import React, { useCallback, useMemo, useState } from "react";
import { PortalModal } from "components/attendee/PortalModal";

import { COVERT_ROOM_TYPES } from "settings";

import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { PartyMapVenue } from "types/venues";

import { eventTimeAndOrderComparator, isEventLiveOrFuture } from "utils/event";
import { isExternalPortal, openUrl } from "utils/url";

import { useSpaceEvents } from "hooks/events";
import { useCustomSound } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";
import { useUser } from "hooks/useUser";

import { Map } from "components/templates/PartyMap/components/Map";

// import { PortalModal } from "components/templates/PartyMap/components/PortalModal";
import styles from "./PartyMap.module.scss";

export interface PartyMapProps {
  venue: PartyMapVenue;
}

export const PartyMap: React.FC<PartyMapProps> = ({ venue }) => {
  const { user, profile } = useUser();

  const [roomRef, setRoomRef] = useState<HTMLDivElement | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const { events: selfAndChildVenueEvents } = useSpaceEvents({
    worldId: venue.worldId,
    spaceIds: [selectedRoom?.spaceId || ""],
  });

  const [firstEvent] = useMemo(() => {
    if (!selfAndChildVenueEvents || !selectedRoom) return [];

    return selfAndChildVenueEvents
      .filter(
        (event) =>
          event.spaceId === selectedRoom.spaceId && isEventLiveOrFuture(event)
      )
      .sort(eventTimeAndOrderComparator);
  }, [selfAndChildVenueEvents, selectedRoom]);

  const selectRoom = useCallback((room: Room) => {
    if (room.type && COVERT_ROOM_TYPES.includes(room.type)) return;

    setSelectedRoom(room);
  }, []);

  const unselectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, []);

  const isUnclickable =
    selectedRoom?.visibility === RoomVisibility.unclickable ||
    selectedRoom?.type === RoomType.unclickable;
  const isCovertRoom =
    selectedRoom?.type && COVERT_ROOM_TYPES.includes(selectedRoom?.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;
  const { enterPortal } = usePortal({ portal: selectedRoom });
  const analytics = useAnalytics({ venue });

  const [enterWithSound] = useCustomSound(selectedRoom?.enterSound, {
    interrupt: true,
    onend: enterPortal,
  });

  const selectRoomWithSound = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!shouldBeClickable || !selectedRoom) return;
      analytics.trackEnterRoomEvent(
        selectedRoom?.title,
        selectedRoom?.template
      );
      isExternalPortal(selectedRoom)
        ? openUrl(selectedRoom?.url)
        : enterWithSound();
    },
    [analytics, enterWithSound, selectedRoom, shouldBeClickable]
  );

  if (!user || !profile) return <>Loading..</>;

  return (
    <div className={styles.PartyMap}>
      <Map
        user={user}
        venue={venue}
        selectRoom={selectRoom}
        unselectRoom={unselectRoom}
        setRoomRef={setRoomRef}
        selectedRoom={selectedRoom}
      />

      {selectedRoom && (
        <PortalModal
          onEnter={selectRoomWithSound}
          portal={selectedRoom}
          event={firstEvent}
          roomRef={roomRef}
        />
      )}
    </div>
  );
};
