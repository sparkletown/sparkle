import React, { FC, useMemo } from "react";

import { useRecentWorldUsers } from "hooks/users";

import { PartyMapRoomData } from "types/PartyMapRoomData";
import { PartyMapVenue } from "types/PartyMapVenue";

import "./RoomAttendance.scss";

interface PropsType {
  venue: PartyMapVenue;
  room: PartyMapRoomData;
}

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: FC<PropsType> = ({ venue, room }) => {
  const { recentWorldUsers } = useRecentWorldUsers();

  // @debt Separete room attendies into a separate hook
  const usersInRoom = useMemo(
    () =>
      recentWorldUsers.filter(
        (partygoer) => partygoer.lastSeenIn?.[`${venue.name}/${room.title}`]
      ),
    [recentWorldUsers, venue.name, room.title]
  );

  const numberOfUsersInRoom = usersInRoom?.length;
  if (numberOfUsersInRoom < 1) return <></>;
  return (
    <div className="attendance-avatars">
      {usersInRoom.map((user, index) => {
        return (
          <div key={`user-avatar-${index}`}>
            {index < MAX_AVATARS_VISIBLE && (
              <div
                className="attendance-avatar"
                style={{ backgroundImage: `url(${user.pictureUrl})` }}
              />
            )}
            <div></div>
          </div>
        );
      })}
      {numberOfUsersInRoom > MAX_AVATARS_VISIBLE && (
        <div className="avatars-inside">
          +{numberOfUsersInRoom - MAX_AVATARS_VISIBLE}
        </div>
      )}
    </div>
  );
};

export default RoomAttendance;
