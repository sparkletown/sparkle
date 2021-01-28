import React, { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PropsType {
  attendees: number;
}

const CampAttendance: FC<PropsType> = ({ attendees }) => {
  return attendees > 0 ? (
    <div className="camp-venue-people-container">
      <div className="camp-venue-people">{attendees}</div>
      <FontAwesomeIcon icon={faUser} />
    </div>
  ) : (
    <></>
  );
};

export default CampAttendance;
