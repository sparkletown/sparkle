import React, { RefObject, useCallback, useMemo } from "react";
import classNames from "classnames";
import { Button } from "components/attendee/Button";
import { EventInfo } from "components/attendee/EventInfo";
import { SpaceInfoText } from "components/attendee/SpaceInfoText";
import { isEqual, omit } from "lodash";

import { COVERT_ROOM_TYPES } from "settings";

import { PartyMapSpaceWithId } from "types/id";
import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { Dimensions, Position } from "types/utility";

import {
  eventTimeAndOrderComparator,
  isEventLive,
  isEventLiveOrFuture,
} from "utils/event";
import { isExternalPortal } from "utils/url";

import { useSpaceEvents } from "hooks/events";
import { useSpaceById } from "hooks/spaces/useSpaceById";
import { useAnalytics } from "hooks/useAnalytics";
import { usePortal } from "hooks/usePortal";

import { RoomAttendance } from "components/templates/PartyMap/components/RoomAttendance";

import styles from "./MapPortal.module.scss";

interface MapPortalProps {
  space: PartyMapSpaceWithId;
  portal: Room;
  selectPortal: (portal: Room) => void;
  safeZoneBounds: Dimensions & Position;
  portalRef: RefObject<HTMLDivElement> | null;
  selectedPortal?: Room;
  unselectPortal: () => void;
}

export const MapPortal: React.FC<MapPortalProps> = ({
  space,
  portal,
  safeZoneBounds,
  selectPortal,
  portalRef,
  selectedPortal,
  unselectPortal,
}) => {
  const { enterPortal } = usePortal({ portal });
  const { space: targetSpace } = useSpaceById({ spaceId: portal.spaceId });

  const analytics = useAnalytics({ venue: space });
  const { events: selfAndChildVenueEvents = [] } = useSpaceEvents({
    worldId: space.worldId,
    spaceIds: [portal.spaceId ?? ""],
  });
  const [firstEvent] = selfAndChildVenueEvents
    .filter(isEventLiveOrFuture)
    .sort(eventTimeAndOrderComparator);

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

  const selectRoomWithSound = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!shouldBeClickable) return;
      analytics.trackEnterRoomEvent(portal.title, portal.template);
      enterPortal();
    },
    [analytics, enterPortal, portal, shouldBeClickable]
  );

  const portalImageClasses = classNames(styles.PortalImage, {
    [styles.livePortalEvent]: isEventLive(firstEvent),
  });

  const cleanPortal = omit(selectedPortal, "bounds");
  const isCurrentRoomSelected = isEqual(cleanPortal, portal);

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

  const externalIconWrapperClasses = classNames(styles.externalIconWrapper, {
    [styles.externalIconShown]: isExternalPortal(portal) && shouldBeClickable,
  });

  return (
    <div
      data-bem="MapPortal"
      className={styles.MapPortal}
      style={roomInlineStyles}
    >
      <div className={styles.PortalOnMap}>
        <div className={portalImageClasses}>
          <img src={portal.image_url} alt={portal.title} />
        </div>

        {/* desktop */}
        <div
          className={styles.portalTitleDesktop}
          ref={isCurrentRoomSelected ? portalRef : null}
        >
          <div className={styles.PortalTitle}>
            <span className={styles.portalName}>{portal.title}</span>
            <RoomAttendance room={portal} />
            <span
              className={externalIconWrapperClasses}
              onClick={selectRoomWithSound}
            >
              <span className={styles.externalIcon} />
            </span>
            {portal.spaceId && (
              <span
                className={styles.InfoButton}
                onClick={() => handleSelectPortal(portal)}
              >
                <span />
              </span>
            )}
          </div>
        </div>

        {/* mobile */}
        <div className={styles.portalInfoMobile}>
          <span className={styles.portalNameMobile}>{portal.title}</span>

          {isEventLiveOrFuture(firstEvent) ? (
            <EventInfo event={firstEvent} />
          ) : (
            targetSpace && (
              <SpaceInfoText space={targetSpace} variant="mobilePortal" />
            )
          )}

          <Button
            onClick={enterPortal}
            variant="intensive"
            width="full"
            withCenteredContent
            marginless
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
};
