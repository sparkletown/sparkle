import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { formatUtcSeconds } from './utils';

export default function Announcements() {
	useFirestoreConnect('announcements');
	const announcements = useSelector(state => state.firestore.ordered.announcements);
	if (announcements === undefined ) {
		return "Loading announcements...";
	}

	return (
		<div>
			<ul className="list-group">
				{announcements.map(announcement =>
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
