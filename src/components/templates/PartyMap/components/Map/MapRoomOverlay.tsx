import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import { retainAttendance } from "store/actions/Attendance";

import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/RoomData";
import { RoomVisibility } from "types/Venue";

import { isTruthy } from "utils/types";

import { useDispatch } from "hooks/useDispatch";

import RoomAttendance from "../RoomAttendance";

import "./MapRoomOverlay.scss";

interface MapRoomOverlayProps {
  venue: PartyMapVenue;
  room: PartyMapRoomData;
  isSelected: boolean;
  selectRoom: () => void;
}

export const MapRoomOverlay: React.FC<MapRoomOverlayProps> = ({
  venue,
  room,
  isSelected,
  selectRoom,
}) => {
  const [roomHovered, setRoomHovered] = useState<PartyMapRoomData | undefined>(
    undefined
  );

  const isRoomHovered = isTruthy(roomHovered);

  const dispatch = useDispatch();

  const handleRoomHovered = useCallback(() => {
    setRoomHovered(room);
    dispatch(retainAttendance(true));
  }, [dispatch, room]);

  const handleRoomUnhovered = useCallback(() => {
    setRoomHovered(undefined);
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const showRoomTitleAlways =
    !venue.roomVisibility ||
    venue.roomVisibility === RoomVisibility.nameCount ||
    venue.roomVisibility === RoomVisibility.count;

  const showRoomTitleWhenHovered =
    venue.roomVisibility === RoomVisibility.hover &&
    roomHovered?.title === room.title;

  const showRoomTitle =
    showRoomTitleAlways || (showRoomTitleWhenHovered && isRoomHovered);

  const containerStyles = useMemo(
    () => ({
      left: `${room.x_percent}%`,
      top: `${room.y_percent}%`,
      width: `${room.width_percent}%`,
      height: `${room.height_percent}%`,
    }),
    [room.height_percent, room.width_percent, room.x_percent, room.y_percent]
  );

  return (
    <div
      className={classNames("room", {
        "room-selected": isSelected,
      })}
      style={containerStyles}
      onClick={selectRoom}
      onMouseEnter={handleRoomHovered}
      onMouseLeave={handleRoomUnhovered}
    >
      <div className="room-image">
        <img src={room.image_url} alt={room.title} />
      </div>

      {showRoomTitle && (
        <div className="room-title">
          {room.title}
          <RoomAttendance venue={venue} room={room} />
        </div>
      )}
    </div>
  );
};
