import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { isConfigValid, isRoomValid } from './validation';

export default function Rooms() {
	useFirestoreConnect(['config', 'rooms']);
	const { configArr, rooms } = useSelector(state => ({
		configArr: state.firestore.ordered.config,
		rooms: state.firestore.ordered.rooms
	}));
	if (configArr === undefined || rooms === undefined) {
		return "Loading rooms & schedule...";
	}
	let config = {};
	configArr.filter(isConfigValid).forEach(v => config[v['name']] = v['value']);

	return (
		<div className="card">
			<div className="card-header">
				<h2>
					<a className="stretched-link"
						href={config['schedule_url']}
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
							{room.subtitle.length > 0 && " - " + room.subtitle}
							{room.open ?
								<span className="badge badge-success ml-2">OPEN</span>
							:
								<span className="badge badge-danger ml-2">CLOSED</span>
							}
						</a>
					</li>
				)}
			</ul>
		</div>
	);
}
