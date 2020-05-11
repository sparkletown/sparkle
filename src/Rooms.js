import React from 'react';
import { isRoomValid } from './validation';

export default function Rooms(props) {
	if (props.rooms === undefined) {
		return "Loading rooms & schedule...";
	}

	return (
		<div className="card" id="rooms">
			<div className="card-header">
				<h2>Room List</h2>
			</div>
			<ul className="list-group">
				{props.rooms
					.filter(isRoomValid)
					.filter(r => r.on_list)
					.concat()
					.sort((a, b) => a.order - b.order)
					.map(room =>
					<li className="list-group-item" key={room.id}>
						<a className="stretched-link"
							href={room.url}
							target="_blank"
							rel="noopener noreferrer"
							title={room.title + " - " + room.subtitle}>
							{room.title}
							{room.open ?
								<span className="badge badge-success mx-2">OPEN</span>
							:
								<span className="badge badge-dark mx-2">CLOSED</span>
							}
						</a>
						<span>- {room.subtitle}</span>
					</li>
				)}
			</ul>
		</div>
	);
}
