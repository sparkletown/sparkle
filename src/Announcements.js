import React from 'react';
import { formatUtcSeconds } from './utils';
import { isAnnouncementValid } from './validation';

export default function Announcements(props) {
	if (props.announcements === undefined ) {
		return "Loading announcements...";
	}

	return (
		<div className="card" id="announcements">
			<div className="card-header">
				<h2>Announcements</h2>
			</div>
			<ul className="list-group">
				{props.announcements.filter(isAnnouncementValid).concat().sort((a, b) => b.ts_utc - a.ts_utc).map(announcement =>
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
