import React, { FC, useMemo } from "react";

import { usePartygoers } from "hooks/users";

import { PartyMapRoomData } from "types/PartyMapRoomData";
import { PartyMapVenue } from "types/PartyMapVenue";

import "./RoomAttendance.scss";

interface PropsType {
  venue: PartyMapVenue;
  room: PartyMapRoomData;
}

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: FC<PropsType> = ({ venue, room }) => {
  const partygoers = usePartygoers();
  const usersInRoom = useMemo(
    () =>
      partygoers?.filter(
        (partygoer) => partygoer.lastSeenIn?.[`${venue.name}/${room.title}`]
      ),
    [partygoers, venue.name, room.title]
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
