import React, { useMemo } from "react";

import { usePartygoers } from "hooks/users";

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
  const partygoers = usePartygoers();

  const usersInRoom = useMemo(
    () =>
      partygoers.filter(
        (partygoer) => partygoer.lastSeenIn?.[`${venue.name}/${room.title}`]
      ),
    [partygoers, venue.name, room.title]
  );

  const numberOfUsersInRoom = usersInRoom.length;
  const numberOfExtraUsersInRoom = Math.max(
    numberOfUsersInRoom - MAX_AVATARS_VISIBLE,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  // @debt use a default image when user.pictureUrl is undefined
  const userAvatars = useMemo(
    () =>
      usersInRoom.slice(0, MAX_AVATARS_VISIBLE).map((user, index) => (
        <div key={`user-avatar-${user.id}`}>
          <div
            className="attendance-avatar"
            style={{ backgroundImage: `url(${user.pictureUrl})` }}
          />
        </div>
      )),
    [usersInRoom]
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
