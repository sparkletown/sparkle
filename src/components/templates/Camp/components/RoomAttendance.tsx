import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface PropsType {
  roomTitle: string;
  attendance?: number;
  onClick?: () => void;
}

export const RoomAttendance: React.FunctionComponent<PropsType> = ({
  roomTitle,
  attendance,
  onClick,
}) => {
  attendance = attendance || 0;
  const singularTitle = `${attendance} person in ${roomTitle}`;
  const pluralTitle = `${attendance} people in ${roomTitle}`;
  const title = attendance === 1 ? singularTitle : pluralTitle;

  if (attendance === 0) return <></>;

  return (
    <div
      className="d-flex room-attendance my-2 positioned"
      style={{
        top: 0,
        left: 0,
      }}
      title={title}
      onClick={onClick}
    >
      <span className="attendance-number">{attendance}</span>
      <FontAwesomeIcon icon={faUser} />
    </div>
  );
};
