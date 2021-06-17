import React from "react";
import { UpcomingEvent } from "types/UpcomingEvent";
import { formatDate, formatTimestampToDisplayHoursMinutes } from "utils/time";
import { externalUrlAdditionalProps } from "/utils/url";

import "./UpcomingTickets.scss";

interface PropsType {
  events: UpcomingEvent[];
}

const UpcomingTickets: React.FunctionComponent<PropsType> = ({ events }) => {
  const sortedEvents = [...events].sort(
    (a: UpcomingEvent, b: UpcomingEvent) =>
      a.ts_utc.toMillis() - b.ts_utc.toMillis()
  );

  return (
    <div className="upcoming-tickets-overlay">
      <h2>Get Tickets for Future Events</h2>
      {sortedEvents.map((event) => {
        const eventDate = event.ts_utc.toDate();

        return (
          <a
            key={event.name}
            className="link"
            href={event.url}
            {...externalUrlAdditionalProps}
          >
            <div className="event">
              <div className="time-section">
                <div className="date">{formatDate(eventDate)}</div>
                <div className="time">
                  {formatTimestampToDisplayHoursMinutes(eventDate)}
                </div>
              </div>
              <div className="event-section">{event.name}</div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default UpcomingTickets;
