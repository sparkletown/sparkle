import React, { useMemo } from "react";

import { usePartygoers } from "hooks/users";

import { PartyMapRoomData } from "types/RoomData";
import { PartyMapVenue } from "types/venues";

import "./RoomAttendance.scss";

interface RoomAttendanceProps {
  venue: PartyMapVenue;
  room: PartyMapRoomData;
}

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: React.FC<RoomAttendanceProps> = ({
  venue,
  room,
}) => {
  const partygoers = usePartygoers();

  const usersInRoom = useMemo(
    () =>
      partygoers?.filter(
        (partygoer) => partygoer.lastSeenIn?.[`${venue.name}/${room.title}`]
      ),
    [partygoers, venue.name, room.title]
  );

  const numberOfUsersInRoom = usersInRoom?.length;
  const numberOfExtraUsersInRoom = Math.max(
    numberOfUsersInRoom - MAX_AVATARS_VISIBLE,
    0
  );
  const hasExtraUsersInRoom = numberOfExtraUsersInRoom > 0;

  const userAvatars = usersInRoom
    .slice(0, MAX_AVATARS_VISIBLE)
    .map((user, index) => (
      <div key={`user-avatar-${user.id ?? index}`}>
        <div
          className="attendance-avatar"
          style={{ backgroundImage: `url(${user.pictureUrl})` }}
        />
      </div>
    ));

  // TODO: do we want to keep this? What happens if we just render the empty wrapper div?
  if (numberOfUsersInRoom < 1) return <></>;

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
