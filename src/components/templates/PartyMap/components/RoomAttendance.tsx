import React, { FC } from "react";

import { PartyMapRoomData } from "types/PartyMapRoomData";
import { PartyMapVenue } from "types/PartyMapVenue";

import { partygoersSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

import "./RoomAttendance.scss";

interface PropsType {
  venue: PartyMapVenue;
  room: PartyMapRoomData;
}

const MAX_AVATARS_VISIBLE = 2;

export const RoomAttendance: FC<PropsType> = ({ venue, room }) => {
  const partygoers = useSelector(partygoersSelector);
  const usersInRoom =
    partygoers?.filter(
      (partygoer) => partygoer.lastSeenIn[`${venue.name}/${room.title}`]
    ) ?? [];
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
