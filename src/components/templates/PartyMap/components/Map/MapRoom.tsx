import React, { useCallback, useMemo } from "react";

import { COVERT_ROOM_TYPES } from "settings";

import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { PartyMapVenue } from "types/venues";

import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";

import { RoomAttendance } from "components/templates/PartyMap/components/RoomAttendance";

import styles from "./MapRoom.module.scss";

export interface MapRoomProps {
  venue: PartyMapVenue;
  room: Room;
  selectRoom: () => void;
}

export const MapRoom: React.FC<MapRoomProps> = ({ venue, room }) => {
  const { enterPortal } = usePortal({ portal: room });
  const analytics = useAnalytics({ venue });

  const isUnclickable =
    room.visibility === RoomVisibility.unclickable ||
    room.type === RoomType.unclickable;
  const isCovertRoom = room.type && COVERT_ROOM_TYPES.includes(room.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;

  const roomInlineStyles = useMemo(
    () => ({
      left: `${room.x_percent}%`,
      top: `${room.y_percent}%`,
      width: `${room.width_percent}%`,
      height: `${room.height_percent}%`,
      zIndex: room.zIndex,
    }),
    [
      room.height_percent,
      room.width_percent,
      room.x_percent,
      room.y_percent,
      room.zIndex,
    ]
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
    <div
      className={styles.MapRoom}
      style={roomInlineStyles}
      /*onClick={shouldBeClickable ? selectRoomWithSound : undefined}
    onMouseEnter={shouldBeClickable ? handleRoomHovered : undefined}
    onMouseLeave={shouldBeClickable ? handleRoomUnhovered : undefined}*/
    >
      <div className={styles.PortalOnMap}>
        <div className={styles.PortalImage} onClick={selectRoomWithSound}>
          <img src={room.image_url} alt={room.title} />
        </div>
        <div className={styles.PortalTitle}>
          {room.title}{" "}
          <span>
            <span></span>
            <RoomAttendance room={room} />
          </span>
          {/* TODO Make the info icon display info */}
          <button className={styles.InfoButton}>
            <span />
          </button>
        </div>
      </div>
      {/* TODO Allow these to be hidden */}
      <div className={styles.PortalPopupInfo}>
        <h3>TODO Lazer Show</h3>
        <p>TODO Put things here</p>
        <button
          className={styles.PortalInfoButton}
          onClick={selectRoomWithSound}
        >
          Enter
        </button>
      </div>
    </div>
  );
};
