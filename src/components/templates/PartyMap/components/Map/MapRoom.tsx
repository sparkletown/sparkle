import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { retainAttendance } from "store/actions/Attendance";

import { Room } from "types/rooms";
import { PartyMapVenue, RoomVisibility } from "types/venues";

import { useDispatch } from "hooks/useDispatch";

import RoomAttendance from "../RoomAttendance";

import "./MapRoom.scss";

interface MapRoomProps {
  venue: PartyMapVenue;
  room: Room;
  selectRoom: () => void;
}

export const MapRoom: React.FC<MapRoomProps> = ({
  venue,
  room,
  selectRoom,
}) => {
  const dispatch = useDispatch();

  const handleRoomHovered = useCallback(() => {
    dispatch(retainAttendance(true));
  }, [dispatch]);

  const handleRoomUnhovered = useCallback(() => {
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const containerClasses = classNames("maproom", {
    "maproom--always-show-label":
      venue.roomVisibility === RoomVisibility.nameCount,
    "maproom--always-show-label-count":
      venue.roomVisibility === RoomVisibility.count,
  });

  const roomPositionStyles = useMemo(
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
      className={containerClasses}
      style={roomPositionStyles}
      onClick={selectRoom}
      onMouseEnter={handleRoomHovered}
      onMouseLeave={handleRoomUnhovered}
    >
      <img className="maproom__image" src={room.image_url} alt={room.title} />

      <div className="maproom__label">
        <span className="maproom__roomtitle">{room.title}</span>
        <RoomAttendance venue={venue} room={room} />
      </div>
    </div>
  );
};
