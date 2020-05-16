import React from 'react';
import { formatUtcSeconds } from './utils';
import { isAnnouncementValid } from './validation';

const ONE_HOUR_MILLIS = 1000 * 60 * 60;

export default function Announcements(props) {
	if (props.announcements === undefined ) {
		return "Loading announcements...";
	}

	const announcements = props.announcements
		.filter(isAnnouncementValid)
		.concat()
		.sort((a, b) => b.ts_utc - a.ts_utc);

	return (
		<div className="card" id="announcements">
			<div className="card-header">
				Announcements
			</div>
			{announcements.length === 0 &&
				<div className="card-body text-center">
	        No announcements yet
	      </div>
			}
			<ul className="list-group">
				{announcements.map(announcement =>
					<li className="list-group-item" key={announcement.id}>
						<b>{announcement.announcer}</b>: {formatUtcSeconds(announcement.ts_utc)}
						<br/>
						{announcement.text}
						{announcement.imageUrl &&
							<a href={announcement.imageUrl} target="_blank" rel="noopener noreferrer">
								<img className="img-fluid" src={announcement.imageUrl} title={"Announcement Image: " + announcement.imageUrl} alt={"Announcement Image: " + announcement.imageUrl} />
							</a>
						}
					</li>
				)}
			</ul>
		</div>
	);
}
