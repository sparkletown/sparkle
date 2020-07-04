import React, { useState } from "react";
import { UpcomingEvent } from "types/UpcomingEvent";
import { formatDate, formatUtcSeconds } from "utils/time";

import "./UpcomingTickets.scss";

interface PropsType {
  events: UpcomingEvent[];
}

const UpcomingTickets: React.FunctionComponent<PropsType> = ({ events }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  events = events.sort(
    (a: UpcomingEvent, b: UpcomingEvent) =>
      a.ts_utc.toMillis() - b.ts_utc.toMillis()
  );

  return (
    <div className="upcoming-tickets-container">
      <div className="ticket-icon">
        <img
          src="/ticket.png"
          className="image"
          alt="Upcoming Event Tickets"
          title="Upcoming Event Tickets"
          onClick={() => setShowOverlay(!showOverlay)}
        />
      </div>
      <div className={"overlay " + (showOverlay ? "d-block" : "d-none")}>
        <h6>Get Tickets for Future Events</h6>
        {events.map((event) => (
          <a
            className="link"
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="event">
              <div className="time-section">
                <div className="date">
                  {formatDate(event.ts_utc.toMillis() / 1000)}
                </div>
                <div className="time">
                  {formatUtcSeconds(event.ts_utc.toMillis() / 1000)}
                </div>
              </div>
              <div className="event-section">{event.name}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTickets;
