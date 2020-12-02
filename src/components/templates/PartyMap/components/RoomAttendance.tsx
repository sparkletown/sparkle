import React from "react";

import { PartyMapVenue } from "types/PartyMapVenue";
import { PartyMapRoomData } from "types/RoomData";

import { partygoersSelector } from "utils/selectors";
import { isTruthy } from "utils/types";

import { useSelector } from "hooks/useSelector";

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
  const partygoers = useSelector(partygoersSelector) ?? [];

  const usersInRoom = partygoers.filter(
    (partygoer) => partygoer.lastSeenIn[`${venue.name}/${room.title}`]
  );

  const numberOfUsersInRoom = usersInRoom?.length;
  const numberOfExtraUsersInRoom = Math.max(
    numberOfUsersInRoom - MAX_AVATARS_VISIBLE,
    0
  );
  const hasExtraUsersInRoom = isTruthy(numberOfExtraUsersInRoom);

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
