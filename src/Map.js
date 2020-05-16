import React from 'react';

import { roomSlug } from './utils';
import { isRoomValid } from './validation';
import {
	MAP_VIEWBOX,
	MAP_URL
} from './config';

export default function Map(props) {
	if (props.rooms === undefined) {
		return "Loading map...";
	}

	return (
		<div id="map">
      <div className="position-relative">
				<svg className="position-absolute" viewBox={MAP_VIEWBOX}>
					{props.rooms
						.filter(isRoomValid)
						.filter(r => r.on_map)
						.map((room, idx) => {
						const color = '#ffffff33';
						return <a
							key={idx}
							data-toggle="modal"
							data-target={"#modal-" + roomSlug(room)}>							
							<path
								d={room.path}
								style={{ fill: color }}>
								<title>{room.title}</title>
							</path>
						</a>;
					})}
				</svg>
				<img className="img-fluid"
					src={MAP_URL}
					title='Clickable Map'
					alt='Clickable Map'/>
			</div>
			<div className="card-body text-center">
        This is a clickable map to help you navigate the party.
        <br/>
        Remember at all times, the party is real. Act accordingly.
      </div>
		</div>
	);
}
