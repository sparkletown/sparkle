import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { COVERT_ROOM_TYPES } from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { PartyMapVenue } from "types/venues";

import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { useDispatch } from "hooks/useDispatch";
import { usePortal } from "hooks/usePortal";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { RoomAttendance } from "components/templates/PartyMap/components/RoomAttendance";

import styles from "./MapRoom.module.scss";

export interface MapRoomProps {
  venue: PartyMapVenue;
  room: Room;
  selectRoom: () => void;
}

export const MapRoom: React.FC<MapRoomProps> = ({
  venue,
  room,
  selectRoom,
}) => {
  const { portalSpaceId, enterPortal } = usePortal({ portal: room });
  const analytics = useAnalytics({ venue });

  const { findVenueInRelatedVenues } = useRelatedVenues({
    currentVenueId: venue.id,
  });
  const portalVenue = findVenueInRelatedVenues({ spaceId: portalSpaceId });

  const hasRecentRoomUsers =
    portalVenue?.recentUserCount && portalVenue?.recentUserCount > 0;

  const isUnclickable =
    room.visibility === RoomVisibility.unclickable ||
    room.type === RoomType.unclickable;
  const isMapFrame = room.type === RoomType.mapFrame;
  const isCovertRoom = room.type && COVERT_ROOM_TYPES.includes(room.type);
  const isLabelHidden =
    (room.visibility === RoomVisibility.none ||
      room.visibility === RoomVisibility.unclickable) ??
    false;
  const shouldShowLabel = !isCovertRoom && !isLabelHidden;
  const shouldBeClickable = !isCovertRoom && !isUnclickable;

  const roomLabelConditions =
    room.visibility === RoomVisibility.nameCount ||
    (room.visibility === RoomVisibility.count && hasRecentRoomUsers);
  const venueLabelConditions =
    venue.roomVisibility === RoomVisibility.nameCount ||
    (venue.roomVisibility === RoomVisibility.count && hasRecentRoomUsers);

  const dispatch = useDispatch();

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const handleRoomHovered = useCallback(() => {
    dispatch(retainAttendance(true));
  }, [dispatch]);

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const handleRoomUnhovered = useCallback(() => {
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const containerClasses = classNames("maproom", {
    "maproom--covert": isCovertRoom,
    "maproom--unclickable": isUnclickable,
    "maproom--iframe": isMapFrame,
    "maproom--always-show-label":
      shouldShowLabel && (roomLabelConditions || venueLabelConditions),
  });

  const titleClasses = classNames("maproom__title", {
    "maproom__title--count":
      !isCovertRoom &&
      (room.visibility === RoomVisibility.count ||
        venue.roomVisibility === RoomVisibility.count),
  });

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
          {room.title} <span><span></span><RoomAttendance room={room} /></span>
          { /* TODO Make the info icon display info */}
          <button className={styles.InfoButton}><span /></button>
        </div>
      </div>
      { /* TODO Allow these to be hidden */}
      <div className={styles.PortalPopupInfo} >
        <h3>TODO Lazer Show</h3>
        <p>TODO Put things here</p>
        <button className={styles.PortalInfoButton} onClick={selectRoomWithSound}>
          Enter
        </button>
      </div>
    </div>
  );
};
