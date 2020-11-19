import React, { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CampRoomData } from "types/CampRoomData";
import { CampVenue } from "types/CampVenue";
import { partygoersSelector } from "utils/selectors";
import { useSelector } from "hooks/useSelector";

interface PropsType {
  venue: CampVenue;
  attendances: { [location: string]: number };
  room: CampRoomData;
}

const CampAttendance: FC<PropsType> = ({ attendances, venue, room }) => {
  const partygoers = useSelector(partygoersSelector);
  const roomLocation = `${venue.name}/${room.title}`;
  const peopleInRoom = partygoers.filter(
    (partygoer) => partygoer.lastSeenIn[roomLocation]
  );
  console.log(peopleInRoom);
  return (
    <>
      {(attendances[roomLocation] ?? 0) + (room.attendanceBoost ?? 0) > 0 && (
        <>
          <div className="camp-venue-people">
            {(attendances[roomLocation] ?? 0) + (room.attendanceBoost ?? 0)}
          </div>
          <FontAwesomeIcon icon={faUser} />
        </>
      )}
      {peopleInRoom.map((person, index) => {
        return (
          <div
            key={`room-person-${index}`}
            style={{
              width: 40,
              height: 40,
              backgroundImage: `url(${person.pictureUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        );
      })}
    </>
  );
};

export default CampAttendance;
