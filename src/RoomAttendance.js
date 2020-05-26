import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function RoomAttendance({ room, attendance, onClick }) {
  attendance = attendance || 0;
  const singularTitle = `${attendance} person in ${room.name}`;
  const pluralTitle = `${attendance} people in ${room.name}`;
  const title = attendance === 1 ? singularTitle : pluralTitle;

  return (
    <div
      className="position-absolute d-flex room-attendance"
      style={{left: room.attendance_x, top: room.attendance_y}}
      title={title}
      onClick={onClick}>
      <div className="icon">
        <FontAwesomeIcon icon={faUser} />
      </div>
      <div className="count">
        {attendance}
      </div>
    </div>
  );
}