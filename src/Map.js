import React, { useState, Fragment } from 'react';

import { useFirestore } from 'react-redux-firebase';

import { isRoomValid } from './validation';
import {
	MAP_VIEWBOX,
	MAP_URL
} from './config';

import RoomModal from './RoomModal';
import RoomAttendance from './RoomAttendance';

export default function Map(props) {
  const firestore = useFirestore();

	const [room, setRoom] = useState();
	const [showModal, setShowModal] = useState();

	function updateRoom(room) {
		setRoom(room);
		setShowModal(true);
		upsertUserRoom(room.name);
	}

  function upsertUserRoom(room) {
  	// Don't update if user is incognito
  	if (!props.user.displayName) {
  		return;
  	}

    const doc = `users/${props.user.uid}`;
    const update = {room: room};
    firestore
      .doc(doc)
      .update(update)
      .catch(e => {
        firestore
          .doc(doc)
          .set(update);
      });
  }

  function roomDeparted() {
    upsertUserRoom(null);
    setShowModal(false);
  }

	if (props.rooms === undefined) {
		return "Loading map...";
	}

	return (
		<Fragment>
			<div id="map">
	      <div className="position-relative">
					<svg className="position-absolute" viewBox={MAP_VIEWBOX}>
						{props.rooms
							.filter(isRoomValid)
							.filter(r => r.on_map)
							.map((room, idx) => {
							const color = '#ffffff33';
							return <a
								key={idx}
								onClick={() => updateRoom(room, idx)}>
								<path
									d={room.path}
									style={{ fill: color }}>
									<title>{room.title}</title>
								</path>
							</a>;
						})}
					</svg>
					{props.rooms
						.filter(isRoomValid)
						.filter(r => r.on_map)
						.filter(r => r.attendance_x && r.attendance_y)
						.map((room, idx) =>
						<RoomAttendance x={room.attendance_x} y={room.attendance_y} count={props.attendances[room.name]} name={room.name} key={idx} />
					)}
					<img className="img-fluid"
						src={MAP_URL}
						title='Clickable Map'
						alt='Clickable Map'/>
				</div>
				<div className="card-body text-center">
	        This is a clickable map to help you navigate the party.
	        <br/>
	        Remember at all times, the party is real. Act accordingly.
	      </div>
			</div>
			<RoomModal show={showModal} room={room} roomDeparted={roomDeparted} />
		</Fragment>
	);
}
