import React, { useCallback, useMemo, useRef, useState } from "react";
import { PortalModal } from "components/attendee/PortalModal";

import { COVERT_ROOM_TYPES } from "settings";

import { PartyMapSpaceWithId } from "types/id";
import { PortalWithBounds, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";

import { eventTimeAndOrderComparator, isEventLiveOrFuture } from "utils/event";

import { useSpaceEvents } from "hooks/events";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";
import { useLiveUser } from "hooks/user/useLiveUser";

import { Map } from "components/templates/PartyMap/components/Map";

import styles from "./PartyMap.module.scss";

interface PartyMapProps {
  venue: PartyMapSpaceWithId;
}

export const PartyMap: React.FC<PartyMapProps> = ({ venue }) => {
  const { user, profile } = useLiveUser();

  const portalRef = useRef<HTMLDivElement | null>(null);
  const [selectedPortal, setSelectedPortal] = useState<
    PortalWithBounds | undefined
  >();

  const { events: selfAndChildVenueEvents } = useSpaceEvents({
    worldId: venue.worldId,
    spaceIds: [selectedPortal?.spaceId || ""],
  });

  const [firstEvent] = useMemo(() => {
    if (!selfAndChildVenueEvents || !selectedPortal) return [];

    return selfAndChildVenueEvents
      .filter(
        (event) =>
          event.spaceId === selectedPortal.spaceId && isEventLiveOrFuture(event)
      )
      .sort(eventTimeAndOrderComparator);
  }, [selfAndChildVenueEvents, selectedPortal]);

  const selectPortal = useCallback((portal: PortalWithBounds) => {
    setSelectedPortal(portal);
  }, []);

  const unselectPortal = useCallback(() => {
    setSelectedPortal(undefined);
  }, []);

  const isUnclickable =
    selectedPortal?.visibility === RoomVisibility.unclickable ||
    selectedPortal?.type === RoomType.unclickable;
  const isCovertRoom =
    selectedPortal?.type && COVERT_ROOM_TYPES.includes(selectedPortal?.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;
  const { enterPortal } = usePortal({ portal: selectedPortal });
  const analytics = useAnalytics({ venue });

  const selectPortalWithSound = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!shouldBeClickable || !selectedPortal) return;
      analytics.trackEnterRoomEvent(
        selectedPortal?.title,
        selectedPortal?.template
      );

      enterPortal();
    },
    [analytics, enterPortal, selectedPortal, shouldBeClickable]
  );

  if (!user || !profile) return <>Loading..</>;

  return (
    <div
      data-bem="PartyMap"
      data-block="PartyMap"
      data-side="att"
      className={styles.PartyMap}
    >
      <Map
        user={user}
        venue={venue}
        selectPortal={selectPortal}
        unselectPortal={unselectPortal}
        portalRef={portalRef}
        selectedPortal={selectedPortal}
      />

      {selectedPortal && (
        <PortalModal
          onEnter={selectPortalWithSound}
          portal={selectedPortal}
          event={firstEvent}
          portalRef={portalRef}
        />
      )}
    </div>
  );
};
