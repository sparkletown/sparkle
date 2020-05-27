import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import { isRoomValid } from './validation';
import {
	MAP_VIEWBOX,
	MAP_URL
} from './config';
import { previewRoom } from './actions';

import RoomModal from './RoomModal';
import RoomAttendance from './RoomAttendance';

export default function Map(props) {
  const dispatch = useDispatch();
	const [showModal, setShowModal] = useState();

	function preview(room) {
		dispatch(previewRoom(room));
		setShowModal(true);
	}

	if (props.rooms === undefined) {
		return 'Loading map...';
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
								onClick={(e) => {e.preventDefault(); preview(room)}}
                href="/">
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
						<RoomAttendance room={room} positioned={true} attendance={props.attendances[room.name]} key={idx} onClick={() => preview(room)} />
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
			<RoomModal show={showModal} onHide={() => setShowModal(false)} />
		</Fragment>
	);
}
