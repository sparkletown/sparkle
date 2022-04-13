import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { isEqual } from "lodash";

import { COVERT_ROOM_TYPES } from "settings";

import { PartyMapSpaceWithId } from "types/id";
import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { Dimensions, Position } from "types/utility";

import { eventTimeAndOrderComparator, isEventLive } from "utils/event";
import { isExternalPortal, openUrl } from "utils/url";

import { useSpaceEvents } from "hooks/events";
import { useCustomSound } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";

import { RoomAttendance } from "components/templates/PartyMap/components/RoomAttendance";

import styles from "./MapPortal.module.scss";

interface MapPortalProps {
  space: PartyMapSpaceWithId;
  portal: Room;
  selectPortal: (portal: Room) => void;
  safeZoneBounds: Dimensions & Position;
  setPortalRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  selectedPortal?: Room;
  unselectPortal: () => void;
}

export const MapPortal: React.FC<MapPortalProps> = ({
  space,
  portal,
  safeZoneBounds,
  selectPortal,
  setPortalRef,
  selectedPortal,
  unselectPortal,
}) => {
  const { enterPortal } = usePortal({ portal });
  const analytics = useAnalytics({ venue: space });
  const { events: selfAndChildVenueEvents = [] } = useSpaceEvents({
    worldId: space.worldId,
    spaceIds: [portal.spaceId ?? ""],
  });
  const [firstEvent] = selfAndChildVenueEvents.sort(
    eventTimeAndOrderComparator
  );

  const isUnclickable =
    portal.visibility === RoomVisibility.unclickable ||
    portal.type === RoomType.unclickable;
  const isCovertRoom = portal.type && COVERT_ROOM_TYPES.includes(portal.type);
  const shouldBeClickable = !isCovertRoom && !isUnclickable;

  // All the percentages are stored as 0 to 100 in the database for historical
  // reasons. We scale them back down here.
  const left =
    safeZoneBounds.left + (safeZoneBounds.width * portal.x_percent) / 100;
  const top =
    safeZoneBounds.top + (safeZoneBounds.height * portal.y_percent) / 100;
  const width = (safeZoneBounds.width * portal.width_percent) / 100;
  const height = (safeZoneBounds.height * portal.height_percent) / 100;

  const roomInlineStyles = useMemo(
    () => ({
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: portal.zIndex,
    }),
    [height, left, portal.zIndex, top, width]
  );

  const [enterWithSound] = useCustomSound(portal.enterSound, {
    interrupt: true,
    onend: enterPortal,
  });

  const selectRoomWithSound = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!shouldBeClickable) return;
      analytics.trackEnterRoomEvent(portal.title, portal.template);
      isExternalPortal(portal) ? openUrl(portal.url) : enterWithSound();
    },
    [analytics, enterWithSound, portal, shouldBeClickable]
  );

  const portalImageClasses = classNames(styles.PortalImage, {
    [styles.livePortalEvent]: isEventLive(firstEvent),
  });

  const isCurrentRoomSelected = isEqual(selectedPortal, portal);

  const handleSelectPortal = useCallback(
    (portal: Room) => {
      if (isCurrentRoomSelected) {
        unselectPortal();
        return;
      }

      selectPortal(portal);
    },
    [isCurrentRoomSelected, selectPortal, unselectPortal]
  );

  return (
    <div className={styles.MapPortal} style={roomInlineStyles}>
      <div className={styles.PortalOnMap}>
        <div className={portalImageClasses} onClick={selectRoomWithSound}>
          <img src={portal.image_url} alt={portal.title} />
        </div>
        <div
          className={styles.portalInfo}
          ref={isCurrentRoomSelected ? setPortalRef : null}
        >
          <div className={styles.PortalTitle}>
            <span>{portal.title}</span>
            <RoomAttendance room={portal} />
            {portal.spaceId && shouldBeClickable && (
              <span
                className={styles.InfoButton}
                onClick={() => handleSelectPortal(portal)}
              >
                <span />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
