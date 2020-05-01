import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { isRoomValid } from './validation';
import {
	MAP_HEIGHT_PERCENT,
	MAP_URL,
	MAP_ALT
} from './config';

export default function Map() {
	useFirestoreConnect('rooms');
	const rooms = useSelector(state => state.firestore.ordered.rooms);
	if (rooms === undefined) {
		return "Loading map...";
	}

	return (
		<div className="card">
	        <div className="card-header">
	            <h2 className="mx-auto">The Bodyssey: Your Map to the Party</h2>
            </div>
            <div className="card-body">
                This is a clickable map to help you navigate the party.
                <br/>
	            Remember at all times, the party is real. Act accordingly.
            </div>
            <div>
				<svg
					viewBox={"0 0 100 " + MAP_HEIGHT_PERCENT}>

					<image
						href={MAP_URL}
						alt={MAP_ALT}
						title={MAP_ALT}
						style={{ width: '100%' }}>
					</image>

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
