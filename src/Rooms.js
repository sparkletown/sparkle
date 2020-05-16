import React, { Fragment } from 'react';

import { PARTY_START_UTC_SECONDS } from './config';
import { roomSlug, formatHour } from './utils';
import { isRoomValid } from './validation';

const ONE_HOUR_IN_SECONDS = 60 * 60;

export default function Rooms(props) {
	if (props.rooms === undefined) {
		return "Loading spaces & schedule...";
	}

	const rooms = props.rooms
		.filter(isRoomValid)
		.filter(r => r.on_list)
		.concat()
		.sort((a, b) => a.order - b.order);

	function upcomingOrCurrent(event) {
		const start = PARTY_START_UTC_SECONDS + (event.start_hour * 60 * 60);
		const end = start + (event.duration_hours * ONE_HOUR_IN_SECONDS);

		const currentTimeSeconds = new Date().getTime() / 1000;
		const oneHourFromNow = currentTimeSeconds + ONE_HOUR_IN_SECONDS;

		const current = (currentTimeSeconds >= start && currentTimeSeconds <= end);
		const upcoming = start >= currentTimeSeconds && start <= oneHourFromNow;
		return current || upcoming;
	}

	return (
		<div className="card" id="experiences">
			<div className="card-header">
				Upcoming & Current Experiences:
			</div>
			<ul className="list-group">
				{rooms.map((room, idx) =>
					<li className="list-group-item" key={idx}>
						<button className="btn btn-link stretched-link"
							data-toggle="modal"
							data-target={"#modal-" + roomSlug(room)}
							title={room.title}>
							{room.name}
						</button>
						{room.events && room.events.filter(upcomingOrCurrent).length > 0 &&
							<ul>
								{room.events.filter(upcomingOrCurrent).map((event, idx) =>
									<li className="my-2" key={idx}>
	                  <b>{formatHour(event.start_hour)}-{formatHour(event.start_hour + event.duration_hours)}: {event.name}</b>
	                  <br/>
	                  Hosted by <b>{event.host}</b>
	                  <br/>
	                  {event.text}
	                  {event.interactivity &&
	                    <Fragment>
	                      <br/>
	                      Interactivity: {event.interactivity}
	                    </Fragment>
	                  }
	                </li>
								)}
							</ul>
						}
					</li>
				)}
			</ul>
		</div>
	);
}
