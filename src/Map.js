import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { isRoomValid } from './validation';
import {
	MAP_VIEWBOX,
	MAP_URL,
	MAP_ALT,
	SCHEDULE_URL
} from './config';

export default function Map() {
	useFirestoreConnect('rooms');
	const rooms = useSelector(state => state.firestore.ordered.rooms);
	if (rooms === undefined) {
		return "Loading map...";
	}

	return (
		<div className="card" id="map">
	        <div className="card-header">
	            <h2 className="text-center">The Bodyssey: Your Map to the Party</h2>
            </div>
            <div className="card-body mx-auto">
                This is a clickable map to help you navigate the party.
                <br/>
	            Remember at all times, the party is real. Act accordingly.
	            <br/>
	            <a type="button" className="btn btn-primary mr-3 mt-3"
					href="#rooms">
					Room List
				</a>
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
            </div>
            <div>
				<svg
					viewBox={MAP_VIEWBOX}>

					<image
						ref={i => i.setAttribute('xlink:href', MAP_URL)}
						href={MAP_URL}
						alt={MAP_ALT}
						title={MAP_ALT}
						style={{ width: '100%' }}>
						<title>{MAP_ALT}</title>
					</image>

					<object
						style={{ position: 'fixed', width: 0, height: 0 }}
						data={MAP_URL}>
						{MAP_ALT}
					</object>

					{rooms.filter(isRoomValid).map(room => {
						const color = room.open ? '#3333ff33' : '#ff333333';
						return <a
							href={room.url}
							target="_blank"
							rel="noopener noreferrer"
							key={room.id}>
							<path
								d={room.path}
								alt={room.title + " - " + room.subtitle}
								title={room.title + " - " + room.subtitle}
								style={{ fill: color }}>
								<title>{room.title}</title>
							</path>
						</a>;
					})}
				</svg>
			</div>
		</div>
	);
}
