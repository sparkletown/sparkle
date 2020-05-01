import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { formatUtcSeconds } from './utils';

function isValid(announcement) {
	return announcement !== undefined &&
		announcement.id !== undefined &&
		announcement.announcer !== undefined &&
		announcement.ts_utc !== undefined &&
		typeof announcement.ts_utc !== 'number' &&
		announcement.text !== undefined;
}

export default function Announcements() {
	useFirestoreConnect('announcements');
	const announcements = useSelector(state => state.firestore.ordered.announcements);
	if (announcements === undefined ) {
		return "Loading announcements...";
	}

	return (
		<div className="card">
			<div className="card-header">
				<h2>Announcements</h2>
			</div>
			<ul className="list-group">
				{announcements.filter(isValid).concat().sort((a, b) => b.ts_utc - a.ts_utc).map(announcement =>
					<li className="list-group-item" key={announcement.id}>
						<b>{announcement.announcer}</b>: {formatUtcSeconds(announcement.ts_utc)}
						<br/>
						{announcement.text}
					</li>
				)}
			</ul>
		</div>
	);
}
