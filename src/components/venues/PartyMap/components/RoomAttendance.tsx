import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { RoomData } from "types/RoomData";

interface PropsType {
  room: RoomData;
  attendance: any;
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
  const singularTitle = `${attendance} person in ${room.title}`;
  const pluralTitle = `${attendance} people in ${room.title}`;
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
