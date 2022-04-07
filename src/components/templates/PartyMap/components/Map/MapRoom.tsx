import React, { useCallback, useMemo } from "react";
import { useToggle } from "react-use";
import { PortalModal } from "components/attendee/PortalModal";

import { ALWAYS_EMPTY_OBJECT, COVERT_ROOM_TYPES } from "settings";

import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { Dimensions, Position } from "types/utility";
import { PartyMapVenue } from "types/venues";

import { eventTimeAndOrderComparator } from "utils/event";
import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { RoomAttendance } from "components/templates/PartyMap/components/RoomAttendance";

import styles from "./MapRoom.module.scss";

export interface MapRoomProps {
  venue: PartyMapVenue;
  room: Room;
  selectRoom: () => void;
  safeZoneBounds: Dimensions & Position;
}

export const MapRoom: React.FC<MapRoomProps> = ({
  venue,
  room,
  safeZoneBounds,
}) => {
  const { enterPortal } = usePortal({ portal: room });
  const analytics = useAnalytics({ venue });
  const { liveAndFutureEvents } = useVenueScheduleEvents({
    userEventIds: ALWAYS_EMPTY_OBJECT,
  });

  const eventsFilledWithPriority = liveAndFutureEvents.sort(
    eventTimeAndOrderComparator
  );
  const [firstEvent] = eventsFilledWithPriority;
  const [infoVisible, toggleInfoVisible] = useToggle(false);

  const isUnclickable =
    room.visibility === RoomVisibility.unclickable ||
    room.type === RoomType.unclickable;
  const isCovertRoom = room.type && COVERT_ROOM_TYPES.includes(room.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;

  // All the percentages are stored as 0 to 100 in the database for historical
  // reasons. We scale them back down here.
  const left =
    safeZoneBounds.left + (safeZoneBounds.width * room.x_percent) / 100;
  const top =
    safeZoneBounds.top + (safeZoneBounds.height * room.y_percent) / 100;
  const width = (safeZoneBounds.width * room.width_percent) / 100;
  const height = (safeZoneBounds.height * room.height_percent) / 100;

  const roomInlineStyles = useMemo(
    () => ({
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: room.zIndex,
    }),
    [height, left, room.zIndex, top, width]
  );

  const [enterWithSound] = useCustomSound(room.enterSound, {
    interrupt: true,
    onend: enterPortal,
  });

  const selectRoomWithSound = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!shouldBeClickable) return;
      analytics.trackEnterRoomEvent(room.title, room.template);
      isExternalPortal(room) ? openUrl(room.url) : enterWithSound();
    },
    [analytics, enterWithSound, room, shouldBeClickable]
  );

  return (
    <div className={styles.MapRoom} style={roomInlineStyles}>
      <div className={styles.PortalOnMap}>
        <div className={styles.PortalImage} onClick={selectRoomWithSound}>
          <img src={room.image_url} alt={room.title} />
        </div>
        <div className={styles.portalInfo}>
          <div className={styles.PortalTitle}>
            <span className={styles.portalName}>{room.title}</span>
            <RoomAttendance room={room} />
            {room.spaceId && (
              <span className={styles.InfoButton} onClick={toggleInfoVisible}>
                <span />
              </span>
            )}
          </div>
          {infoVisible && (
            <PortalModal
              onEnter={selectRoomWithSound}
              portal={room}
              event={firstEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
};
