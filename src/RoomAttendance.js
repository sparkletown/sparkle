import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function RoomAttendance({
  room,
  attendance,
  positioned,
  onClick,
}) {
  attendance = attendance || 0;
  const singularTitle = `${attendance} person in ${room.name}`;
  const pluralTitle = `${attendance} people in ${room.name}`;
  const title = attendance === 1 ? singularTitle : pluralTitle;

  const className =
    "d-flex room-attendance my-2" + (positioned ? " positioned" : "");
  const style = positioned
    ? { left: room.attendance_x, top: room.attendance_y }
    : null;

  return (
    <div className={className} style={style} title={title} onClick={onClick}>
      <div className="icon">
        <FontAwesomeIcon icon={faUser} />
      </div>
      <div className="count">{attendance}</div>
    </div>
  );
}
