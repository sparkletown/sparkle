import React from 'react';
import { isRoomValid } from './validation';
import {
	MAP_VIEWBOX,
	MAP_URL,
	MAP_ALT,
	SCHEDULE_URL
} from './config';

export default function Map(props) {
	if (props.rooms === undefined) {
		return "Loading map...";
	}

	return (
		<div className="card" id="map">
	        <div className="card-header">
	            <h2 className="text-center">The Bodyssey: Your Map to the Party</h2>
            </div>
            <div className="card-body text-center">
                This is a clickable map to help you navigate the party.
                <br/>
	            Remember at all times, the party is real. Act accordingly.
	            <br/>
	            <a type="button" className="btn btn-primary mr-3 mt-3"
					href={SCHEDULE_URL}
					target="_blank"
					rel="noopener noreferrer">
					Schedule of Events
				</a>
				<a type="button" className="btn btn-primary mr-3 mt-3"
					href="#announcements">
					Announcements
				</a>
	            <a type="button" className="btn btn-primary mr-3 mt-3"
					href="#rooms">
					List of Rooms
				</a>
            </div>
            <div className="position-relative">
				<svg className="position-absolute" viewBox={MAP_VIEWBOX}>
					{props.rooms
						.filter(isRoomValid)
						.filter(r => r.on_map)
						.map(room => {
						const color = room.open ? '#3333ff33' : '#ff333333';
						return <a
							href={room.url}
							target="_blank"
							rel="noopener noreferrer"
							key={room.id}>
							<path
								d={room.path}
								style={{ fill: color }}>
								<title>{room.title} - {room.subtitle}</title>
							</path>
						</a>;
					})}
				</svg>
				<img className="img-fluid"
					src={MAP_URL}
					title={MAP_ALT}
					alt={MAP_ALT}/>
			</div>
		</div>
	);
}
