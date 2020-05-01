import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

export default function Map() {
	useFirestoreConnect(['config', 'rooms']);
	const { configArr, rooms } = useSelector(state => ({
		configArr: state.firestore.ordered.config,
		rooms: state.firestore.ordered.rooms
	}));
	if (configArr === undefined || rooms === undefined) {
		return "Loading map...";
	}
	const config = configArr.reduce((obj, c) => (
		{...obj, [c['name']]: c['value']}
	));

	return (
		<div>
			<svg
				style={{ top: 0, left: 0 }}
				viewBox="0 0 100 100">

				<image
					href={config['map_url']}
					alt={config['map_alt']}
					title={config['map_alt']}
					style={{ width: '100%' }}>
					<title>{config['map_alt']}</title>
				</image>

				{rooms.map(room => {
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
							<title>{room.alt}</title>
						</path>
					</a>;
				})}
			</svg>
		</div>
	);
}
