import React from 'react';

import { isRoomValid } from './validation';

export default function Rooms(props) {
	if (props.rooms === undefined) {
		return "Loading spaces & schedule...";
	}

	const rooms = props.rooms
		.filter(isRoomValid)
		.filter(r => r.on_list)
		.concat()
		.sort((a, b) => a.order - b.order);
	console.log('rooms', props.rooms, props.rooms.filter(isRoomValid));

	return (
		<div className="card" id="experiences">
			<div className="card-header">
				Available Experiences:
			</div>
			<ul className="list-group">
				{rooms.map(room =>
					<li className="list-group-item" key={room.id}>
						<a className="stretched-link"
							href={room.url}
							target="_blank"
							rel="noopener noreferrer"
							title={room.title}>
							{room.name}
						</a>
					</li>
				)}
			</ul>
		</div>
	);
}
