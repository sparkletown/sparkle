import React, { useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { useToggle } from "react-use";

import { COVERT_ROOM_TYPES, POPOVER_CONTAINER_ID } from "settings";

import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { Dimensions, Position } from "types/utility";
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
  safeZoneBounds: Dimensions & Position;
}

export const MapRoom: React.FC<MapRoomProps> = ({
  venue,
  room,
  safeZoneBounds,
}) => {
  const { enterPortal } = usePortal({ portal: room });
  const analytics = useAnalytics({ venue });
  const [infoVisible, toggleInfoVisible] = useToggle(false);

  const isUnclickable =
    room.visibility === RoomVisibility.unclickable ||
    room.type === RoomType.unclickable;
  const isCovertRoom = room.type && COVERT_ROOM_TYPES.includes(room.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;

  const left = safeZoneBounds.left + safeZoneBounds.width * room.x_percent;
  const top = safeZoneBounds.top + safeZoneBounds.height * room.y_percent;
  const width = safeZoneBounds.width * room.width_percent;
  const height = safeZoneBounds.height * room.height_percent;

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

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement
  );

  const popoverContainerElement = document.querySelector(
    `#${POPOVER_CONTAINER_ID}`
  );

  return (
    <div className={styles.MapRoom} style={roomInlineStyles}>
      <div className={styles.PortalOnMap}>
        <div className={styles.PortalImage} onClick={selectRoomWithSound}>
          <img src={room.image_url} alt={room.title} />
        </div>
        <div className={styles.portalInfo}>
          <div className={styles.PortalTitle}>
            {room.title}
            <span>
              <span></span>
              <RoomAttendance room={room} />
            </span>
            <span
              className={styles.InfoButton}
              ref={setReferenceElement}
              onClick={toggleInfoVisible}
            >
              <span />
            </span>
          </div>
          {infoVisible &&
            popoverContainerElement &&
            ReactDOM.createPortal(
              <div
                className={styles.PortalPopupInfo}
                ref={setPopperElement}
                style={popperStyles.popper}
                {...popperAttributes.popper}
              >
                <h3>TODO Title</h3>
                <p>TODO</p>
                <span
                  className={styles.PortalInfoButton}
                  onClick={selectRoomWithSound}
                >
                  Enter
                </span>
              </div>,
              popoverContainerElement
            )}
        </div>
      </div>
    </div>
  );
};
