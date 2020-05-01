import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

export default function Map() {
	useFirestoreConnect(['config', 'map']);
	const { configArr, mapRegions } = useSelector(state => ({
		configArr: state.firestore.ordered.config,
		mapRegions: state.firestore.ordered.map
	}));
	if (configArr === undefined || mapRegions === undefined) {
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

				{mapRegions.filter(r => r.enabled).map(region => {
					return <a
						href={region.url}
						target="_blank"
						rel="noopener noreferrer"
						key={region.id}>
						<path
							d={region.path}
							alt={region.alt}
							title={region.alt}
							style={{ fill: "#3333ff33" }}>
							<title>{region.alt}</title>
						</path>
					</a>;
				})}
			</svg>
		</div>
	);
}
