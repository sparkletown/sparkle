import React, { FC, useMemo } from "react";

import { useRecentLocationUsers } from "hooks/users";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import "./RoomAttendance.scss";

interface RoomAttendanceProps {
  venue: PartyMapVenue;
  room: Room;
}

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: React.FC<RoomAttendanceProps> = ({
  venue,
  room,
}) => {
  const { recentLocationUsers } = useRecentLocationUsers(venue.name);

  console.log(venue.name, room, { recentLocationUsers });

  const numberOfRecentRoomUsers = recentLocationUsers.length;
  const numberOfExtraUsersInRoom = Math.max(
    numberOfRecentRoomUsers - MAX_AVATARS_VISIBLE,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  // @debt use a default image when user.pictureUrl is undefined
  const userAvatars = useMemo(
    () =>
      recentLocationUsers.slice(0, MAX_AVATARS_VISIBLE).map((user, index) => (
        <div key={`user-avatar-${user.id}`}>
          <div
            className="attendance-avatar"
            style={{ backgroundImage: `url(${user.pictureUrl})` }}
          />
        </div>
      )),
    [recentLocationUsers]
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
