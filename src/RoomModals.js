import React, { Fragment } from 'react';

import { roomSlug, formatHour } from './utils';
import { isRoomValid } from './validation';

export default function RoomModals(props) {
  if (props.rooms === undefined) {
    return <Fragment/>;
  }

  const rooms = props.rooms
    .filter(isRoomValid);

  return (
    <Fragment>
    {rooms.map((room, idx) => 
      <div
        className="modal fade"
        id={"modal-" + roomSlug(room)}
        key={idx}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={"modal" + idx + "label"}
        aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={"modal" + idx + "label"}>Welcome to {room.name}!</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div>
                {room.title}
                <a type="button" className="btn btn-success float-right" href={room.url} target="_blank" rel="noopener noreferrer">Jump in!</a>
              </div>
              {room.events && room.events.length > 0 &&
                <div>
                  Lineup:
                  <ul>
                    {room.events.map((event, idx) =>
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
                </div>
              }
            </div>
            <div className="modal-footer">
              <a type="button" className="btn btn-success" href={room.url} target="_blank" rel="noopener noreferrer">Jump in!</a>
            </div>
          </div>
        </div>
      </div>
    )}
    </Fragment>
  );
}