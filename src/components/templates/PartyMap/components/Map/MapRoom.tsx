import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { retainAttendance } from "store/actions/Attendance";

import { Room, RoomTypes } from "types/rooms";
import { PartyMapVenue, RoomVisibility } from "types/venues";

import { useCustomSound } from "hooks/sounds";
import { useDispatch } from "hooks/useDispatch";
import { useRoom } from "hooks/useRoom";

import RoomAttendance from "../RoomAttendance";

import "./MapRoom.scss";

const noop = () => {};

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
  const { recentRoomUsers } = useRoom({ room, venueName: venue.name });
  const hasRecentRoomUsers = recentRoomUsers.length > 0;

  const isUnclickable = room.type === RoomTypes.unclickable;
  const isIframe = room.type === RoomTypes.iframe;

  const dispatch = useDispatch();

  const handleRoomHovered = useCallback(() => {
    dispatch(retainAttendance(true));
  }, [dispatch]);

  const handleRoomUnhovered = useCallback(() => {
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const containerClasses = classNames("maproom", {
    "maproom--unclickable": isUnclickable,
    "maproom--iframe": isIframe,
    "maproom--always-show-label":
      !isUnclickable &&
      !isIframe &&
      (venue.roomVisibility === RoomVisibility.nameCount ||
        (venue.roomVisibility === RoomVisibility.count && hasRecentRoomUsers)),
  });

  const titleClasses = classNames("maproom__title", {
    "maproom__title--count":
      !isUnclickable &&
      !isIframe &&
      venue.roomVisibility === RoomVisibility.count,
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
  const selectRoomWithSound = useCallback(() => {
    play();
    selectRoom();
  }, [play, selectRoom]);

  return (
    <div
      className={containerClasses}
      style={roomInlineStyles}
      onClick={isUnclickable || isIframe ? noop : selectRoomWithSound}
      onMouseEnter={isUnclickable || isIframe ? noop : handleRoomHovered}
      onMouseLeave={isUnclickable || isIframe ? noop : handleRoomUnhovered}
    >
      {!isIframe ? (
        <img className="maproom__image" src={room.image_url} alt={room.title} />
      ) : (
        <iframe
          title={room.title}
          id={`${room.type}-${room.title}`}
          scrolling="no"
          allow="autoplay"
          src={room.url}
        />
      )}

      {!isUnclickable && !isIframe && (
        <div className="maproom__label">
          <span className={titleClasses}>{room.title}</span>
          <RoomAttendance venue={venue} room={room} />
        </div>
      )}
    </div>
  );
};
