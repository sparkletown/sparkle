import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { SubVenue } from "types/PartyMapVenue";
import { WithId } from "utils/id";

interface PropsType {
  room: WithId<SubVenue>;
  attendance?: number;
  positioned?: boolean;
  onClick?: () => void;
}

const RoomAttendance: React.FunctionComponent<PropsType> = ({
  room,
  attendance,
  positioned,
  onClick,
}) => {
  attendance = attendance || 0;
  const singularTitle = `${attendance} person in ${room.id}`;
  const pluralTitle = `${attendance} people in ${room.id}`;
  const title = attendance === 1 ? singularTitle : pluralTitle;

  const className =
    "d-flex room-attendance my-2" + (positioned ? " positioned" : "");
  const style = positioned
    ? { left: room.attendance_x, top: room.attendance_y }
    : undefined;

  return (
    <div
      className={className}
      style={style}
      title={title}
      onClick={onClick}
      id={`attendance-number-${title}`}
    >
      <span className="attendance-number">{attendance}</span>
      <FontAwesomeIcon icon={faUser} />
    </div>
  );
};

export default RoomAttendance;
