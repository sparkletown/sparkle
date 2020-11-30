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
      {/* TODO: extract this + useMemo */}
      {usersInRoom.map((user, index) => {
        return (
          <div key={`user-avatar-${index}`}>
            {index < MAX_AVATARS_VISIBLE && (
              <div
                className="attendance-avatar"
                style={{ backgroundImage: `url(${user.pictureUrl})` }}
              />
            )}
            {/* TODO: do we need this empty div here? If so, why? */}
            <div />
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

// TODO: this was how CampAttendance looked before we deleted it
// const CampAttendance: FC<PropsType> = ({ attendees }) => {
//   return attendees > 0 ? (
//       <div className="camp-venue-people-container">
//         <div className="camp-venue-people">{attendees}</div>
//         <FontAwesomeIcon icon={faUser} />
//       </div>
//   ) : (
//       <></>
//   );
// };

export default RoomAttendance;
