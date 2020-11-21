import React, { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CampRoomData } from "types/CampRoomData";
import { PartyMapVenue } from "types/PartyMapVenue";

interface PropsType {
  venue: PartyMapVenue;
  attendances: { [location: string]: number };
  room: CampRoomData;
}

export const RoomAttendance: FC<PropsType> = ({ attendances, venue, room }) => {
  return (
    <>
      {(attendances[`${venue.name}/${room.title}`] ?? 0) +
        (room.attendanceBoost ?? 0) >
        0 && (
        <>
          <div className="camp-venue-people">
            {(attendances[`${venue.name}/${room.title}`] ?? 0) +
              (room.attendanceBoost ?? 0)}
          </div>
          <FontAwesomeIcon icon={faUser} />
        </>
      )}
    </>
  );
};

export default RoomAttendance;
