import React, { useMemo } from "react";

import { useRoom } from "hooks/useRoom";
import { DEFAULT_ROOM_ATTENDANCE_LIMIT } from "settings";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import "./RoomAttendance.scss";

type RoomAttendanceProps = {
  venue: PartyMapVenue;
  room: Room;
  maxVisible?: number;
};

export const RoomAttendance: React.FC<RoomAttendanceProps> = ({
  venue,
  room,
  maxVisible = DEFAULT_ROOM_ATTENDANCE_LIMIT,
}) => {
  const { recentRoomUsers } = useRoom({ room, venueName: venue.name });

  const numberOfExtraUsersInRoom = Math.max(
    recentRoomUsers.length - maxVisible,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  // @debt use a default image when user.pictureUrl is undefined
  const userAvatars = useMemo(
    () =>
      recentRoomUsers.slice(0, maxVisible).map((user) => (
        <div key={`user-avatar-${user.id}`}>
          <div
            className="attendance-avatar"
            style={{ backgroundImage: `url(${user.pictureUrl})` }}
          />
        </div>
      )),
    [maxVisible, recentRoomUsers]
  );

  return (
    <div className="attendance-avatars">
      {userAvatars}

      {hasExtraUsersInRoom && (
        <div className="avatars-inside">+{numberOfExtraUsersInRoom}</div>
      )}
    </div>
  );
};

export default RoomAttendance;
