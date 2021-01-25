import React, { FC } from "react";

import { useRecentRoomUsers } from "hooks/users";

import { PartyMapRoomData } from "types/PartyMapRoomData";
import { PartyMapVenue } from "types/PartyMapVenue";

import "./RoomAttendance.scss";

interface PropsType {
  venue: PartyMapVenue;
  room: PartyMapRoomData;
}

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: FC<PropsType> = ({ venue, room }) => {
  const { recentRoomUsers } = useRecentRoomUsers(room.title);

  const numberOfUsersInRoom = recentRoomUsers.length;
  if (numberOfUsersInRoom < 1) return null;

  return (
    <div className="attendance-avatars">
      {recentRoomUsers.map((user, index) => {
        return (
          <div key={`user-avatar-${user.id}`}>
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
