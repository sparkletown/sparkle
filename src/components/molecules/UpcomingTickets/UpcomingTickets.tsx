import React from "react";
import { UpcomingEvent } from "types/UpcomingEvent";
import { formatDate, formatUtcSeconds } from "utils/time";

import "./UpcomingTickets.scss";

interface PropsType {
  events: UpcomingEvent[];
}

const UpcomingTickets: React.FunctionComponent<PropsType> = ({ events }) => {
  events = events.sort(
    (a: UpcomingEvent, b: UpcomingEvent) =>
      a.ts_utc.toMillis() - b.ts_utc.toMillis()
  );

  return (
    <div className="upcoming-tickets-overlay">
      <h2>Get Tickets for Future Events</h2>
      {events.map((event) => (
        <a
          key={event.name}
          className="link"
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="event">
            <div className="time-section">
              <div className="date">{formatDate(event.ts_utc.toDate())}</div>
              <div className="time">
                {formatUtcSeconds(event.ts_utc.toMillis() / 1000)}
              </div>
            </div>
            <div className="event-section">{event.name}</div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default UpcomingTickets;
