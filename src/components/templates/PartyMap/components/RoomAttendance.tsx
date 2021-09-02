import React, { useMemo } from "react";

import { DEFAULT_ROOM_ATTENDANCE_LIMIT } from "settings";

import { Room } from "types/rooms";
import { User } from "types/User";
import { PartyMapVenue } from "types/venues";

import { WithId } from "utils/id";

import { useRoom } from "hooks/useRoom";

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
  const { recentRoomUsers } = useRoom({ room, venueId: venue.id });

  const numberOfExtraUsersInRoom = Math.max(
    recentRoomUsers.length - maxVisible,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  const userList = recentRoomUsers as readonly WithId<User>[];
  // @debt use a default image when user.pictureUrl is undefined
  const userAvatars = useMemo(
    () =>
      userList.slice(0, maxVisible).map((user) => (
        <div key={`user-avatar-${user.id}`}>
          <div
            className="attendance-avatar"
            style={{ backgroundImage: `url(${user.pictureUrl})` }}
          />
        </div>
      )),
    [maxVisible, userList]
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
