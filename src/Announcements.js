import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { formatUtcSeconds } from './utils';
import { isAnnouncementValid } from './validation';

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
				{announcements.filter(isAnnouncementValid).concat().sort((a, b) => b.ts_utc - a.ts_utc).map(announcement =>
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
