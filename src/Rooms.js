import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { formatUtcSeconds } from './utils';

export default function Rooms() {
	useFirestoreConnect('rooms');
	const rooms = useSelector(state => state.firestore.ordered.rooms);
	if (rooms === undefined ) {
		return "Loading rooms...";
	}

	return (
		<div>
			{rooms.map(room =>
				<div className="card" key={room.id}>
					<div className="card-header">
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
					</div>
					<div className="card-body">
						Lineup:
						<ul>
							{room.lineup.map((item, index) =>
								<li key={"room_" + index}>
									<b>{item.title}</b>
									<br/>
									{formatUtcSeconds(item.start_utc.seconds)} - {formatUtcSeconds(item.start_utc.seconds + (item.duration_minutes*60))}
								</li>
							)}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
