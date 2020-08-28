import React from "react";
import { WithId } from "utils/id";
import { AnyVenue } from "types/Firestore";
import {
  formatHourAndMinute,
  daysFromStartOfEvent,
  daysFromEndOfEvent,
} from "utils/time";
import "./EventDisplay.scss";

interface PropsType {
  event: firebase.firestore.DocumentData;
  venue: WithId<AnyVenue>;
  joinNowButton: boolean;
}

export const EventDisplay: React.FunctionComponent<PropsType> = ({
  event,
  venue,
  joinNowButton,
}) => {
  return (
    <div
      key={event.name + Math.random().toString()}
      className={`event ${
        Date.now() > event.start_utc_seconds * 1000 ? "event_live" : ""
      }`}
    >
      <div className="event-time">
        <div className="event-time-start">
          {daysFromStartOfEvent(event.start_utc_seconds) === 0
            ? "Starts today at:"
            : daysFromStartOfEvent(event.start_utc_seconds) > 0
            ? `Started ${daysFromStartOfEvent(
                event.start_utc_seconds
              )} days ago at:`
            : `Starts in ${-daysFromStartOfEvent(
                event.start_utc_seconds
              )} days at:`}
        </div>
        <div>{formatHourAndMinute(event.start_utc_seconds)}</div>
        <div className="event-time-end">
          {daysFromEndOfEvent(
            event.start_utc_seconds,
            event.duration_minutes
          ) === 0
            ? "Ends today at:"
            : `Ends in ${daysFromEndOfEvent(
                event.start_utc_seconds,
                event.duration_minutes
              )} days at:`}
        </div>
        <div>
          {formatHourAndMinute(
            event.start_utc_seconds + event.duration_minutes * 60
          )}
        </div>
        {Date.now() > event.start_utc_seconds * 1000 && joinNowButton && (
          <div className="event-badge-live">Live</div>
        )}
        <div style={{ marginTop: 10 }}>Venue: {venue.name}</div>
      </div>
      <div className="event-text">
        <h5>{event.name}</h5>
        <p className="small">
          {joinNowButton ? event.description : event.description.slice(0, 100)}
          {(!joinNowButton && event.description.length) > 100 ? "..." : ""}
        </p>
        {Date.now() > event.start_utc_seconds * 1000 && joinNowButton && (
          <a
            href={`/in/playa/${venue.id}`}
            className="btn btn-primary button-join-now"
          >
            Join Now
          </a>
        )}
      </div>
    </div>
  );
};
