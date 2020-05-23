import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';

export default function RoomAttendance(props) {
  const attendance = props.count || 0;
  const singularTitle = `${attendance} person in ${props.name}`;
  const pluralTitle = `${attendance} people in ${props.name}`;
  const title = attendance === 1 ? singularTitle : pluralTitle;

  return (
    <div className="position-absolute d-flex room-attendance" style={{left: props.x, top: props.y}} title={title}>
      <div className="icon">
        <FontAwesomeIcon icon={faUser} />
      </div>
      <div className="count">
        {attendance}
      </div>
    </div>
  );
}