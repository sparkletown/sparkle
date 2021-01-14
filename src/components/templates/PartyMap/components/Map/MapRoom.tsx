import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import { retainAttendance } from "store/actions/Attendance";

import { Room } from "types/rooms";
import { PartyMapVenue, RoomVisibility } from "types/venues";

import { isTruthy } from "utils/types";

import { useDispatch } from "hooks/useDispatch";

import RoomAttendance from "../RoomAttendance";

import "./MapRoom.scss";

interface MapRoomProps {
  venue: PartyMapVenue;
  room: Room;
  isSelected: boolean;
  selectRoom: () => void;
}

export const MapRoom: React.FC<MapRoomProps> = ({
  venue,
  room,
  isSelected,
  selectRoom,
}) => {
  const [roomHovered, setRoomHovered] = useState<Room | undefined>(undefined);

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
      className={classNames("map-room-container", {
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
