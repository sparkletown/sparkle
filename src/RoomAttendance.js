import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';

export default function RoomAttendance(props) {
  const attendance = props.attendance || 0;
  const singularTitle = `${attendance} person in ${props.name}`;
  const pluralTitle = `${attendance} people in ${props.name}`;
  const title = attendance === 1 ? singularTitle : pluralTitle;

  return (
    <a
      className="position-absolute d-flex room-attendance"
      style={{left: props.room.attendance_x, top: props.room.attendance_y}}
      title={title}
      onClick={props.onClick}>
      <div className="icon">
        <FontAwesomeIcon icon={faUser} />
      </div>
      <div className="count">
        {attendance}
      </div>
    </a>
  );
}