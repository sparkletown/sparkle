import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';

import { formatHour } from './utils';

export default function RoomModal(props) {
  if (!props.room) {
    return <Fragment/>;
  }

  return (
    <Modal show={props.show} onHide={props.roomDeparted}>
      <Modal.Header closeButton>
        <Modal.Title>
          Welcome to {props.room.name}!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {props.room.title}
          <a type="button" className="btn btn-success float-right" href={props.room.url} target="_blank" rel="noopener noreferrer">Jump in!</a>
        </div>
        {props.room.events && props.room.events.length > 0 &&
          <div>
            Lineup:
            <ul>
              {props.room.events.map((event, idx) =>
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
      </Modal.Body>
      <Modal.Footer>
        <a type="button" className="btn btn-success" href={props.room.url} target="_blank" rel="noopener noreferrer">Jump in!</a>
      </Modal.Footer>
    </Modal>
  );
}