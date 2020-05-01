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
		<div className="accordion">
			{rooms.map(room =>
				<div className="card" key={room.id}>
					<div className="card-header" id={room.id}>
						<h2 className="mb-0">
							<button className="btn btn-link" type="button" data={{ toggle: "collapse", target: "#" + room.id}}>
								{room.title}{room.subtitle.length > 0 && " - " + room.subtitle}
							</button>
						</h2>
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
