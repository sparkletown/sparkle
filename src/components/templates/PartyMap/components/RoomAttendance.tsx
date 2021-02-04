import React, { useMemo } from "react";

import { useRoom } from "hooks/useRoom";

import { Room } from "types/rooms";
import { PartyMapVenue } from "types/venues";

import "./RoomAttendance.scss";

type RoomAttendanceProps = {
  venue: PartyMapVenue;
  room: Room;
};

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: React.FC<RoomAttendanceProps> = ({
  venue,
  room,
}) => {
  const { recentRoomUsers } = useRoom({ room, venueName: venue.name });

  const numberOfRecentRoomUsers = recentRoomUsers.length;
  const numberOfExtraUsersInRoom = Math.max(
    numberOfRecentRoomUsers - MAX_AVATARS_VISIBLE,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  // @debt use a default image when user.pictureUrl is undefined
  const userAvatars = useMemo(
    () =>
      recentRoomUsers.slice(0, MAX_AVATARS_VISIBLE).map((user) => (
        <div key={`user-avatar-${user.id}`}>
          <div
            className="attendance-avatar"
            style={{ backgroundImage: `url(${user.pictureUrl})` }}
          />
        </div>
      )),
    [recentRoomUsers]
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
