import React, { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Attendances } from "types/Attendances";
import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";

interface PropsType {
  venue: CampVenue;
  attendances: Attendances;
  room: CampRoomData;
}

const CampAttendance: FC<PropsType> = ({ attendances, venue, room }) => {
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

export default CampAttendance;
