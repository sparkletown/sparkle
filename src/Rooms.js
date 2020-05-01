import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { isRoomValid } from './validation';
import { SCHEDULE_URL } from './config';

export default function Rooms() {
	useFirestoreConnect('rooms');
	const rooms = useSelector(state => state.firestore.ordered.rooms);
	if (rooms === undefined) {
		return "Loading rooms & schedule...";
	}

	return (
		<div className="card">
			<div className="card-header">
				<h2>
					<a className="stretched-link"
						href={SCHEDULE_URL}
						target="_blank"
						rel="noopener noreferrer">
						Rooms & Schedule
					</a>
				</h2>
			</div>
			<ul className="list-group">
				{rooms.filter(isRoomValid).map(room =>
					<li className="list-group-item" key={room.id}>
						<a className="stretched-link"
							href={room.url}
							target="_blank"
							rel="noopener noreferrer">
							{room.title}
							{room.open ?
								<span className="badge badge-success mx-2">OPEN</span>
							:
								<span className="badge badge-danger mx-2">CLOSED</span>
							}
						</a>
						<span>{room.subtitle.length > 0 && " - " + room.subtitle}</span>
					</li>
				)}
			</ul>
		</div>
	);
}
