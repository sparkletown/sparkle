import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { COVERT_ROOM_TYPES, IFRAME_ALLOW } from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room, RoomType } from "types/rooms";
import { RoomVisibility } from "types/RoomVisibility";
import { PartyMapVenue } from "types/venues";

import { useCustomSound } from "hooks/sounds";
import { useDispatch } from "hooks/useDispatch";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";

import { RoomAttendance } from "components/templates/PartyMap/components/RoomAttendance";

import "./MapRoom.scss";

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
  const { portalSpaceId } = useRoom({ room });

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

  const [play] = useCustomSound(room.enterSound, { interrupt: true });
  const selectRoomWithSound = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      play();
      selectRoom();
      e.currentTarget.blur();
    },
    [play, selectRoom]
  );

  return (
    <button
      className={containerClasses}
      style={roomInlineStyles}
      onClick={shouldBeClickable ? selectRoomWithSound : undefined}
      onMouseEnter={shouldBeClickable ? handleRoomHovered : undefined}
      onMouseLeave={shouldBeClickable ? handleRoomUnhovered : undefined}
    >
      {isMapFrame ? (
        <iframe
          className="maproom__iframe"
          src={room.url}
          title={room.title}
          allow={IFRAME_ALLOW}
          frameBorder="0"
        />
      ) : (
        <img className="maproom__image" src={room.image_url} alt={room.title} />
      )}

      {shouldShowLabel && (
        <div className="maproom__label">
          <span className={titleClasses}>{room.title}</span>
          <RoomAttendance room={room} />
        </div>
      )}
    </button>
  );
};
