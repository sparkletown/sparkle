import React from "react";
import { Event } from "types/Room";
import { formatHour } from "utils/time";
import "./ScheduleItem.scss";

interface PropsType {
  startUtcSeconds: number;
  event: Event;
  isCurrentEvent: boolean;
  enterRoom: () => void;
  roomUrl: string;
}

const ScheduleItem: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  event,
  isCurrentEvent,
  enterRoom,
  roomUrl,
}) => (
  <div className="shedule-item-container">
    <div className={`time-section ${isCurrentEvent ? "primary" : ""}`}>
      <div>
        <b>{formatHour(event.start_hour, startUtcSeconds)}</b>
      </div>
      <div>
        {formatHour(
          event.start_hour + event.duration_hours / 60,
          startUtcSeconds
        )}
      </div>
    </div>
    <div className="event-section">
      <div>
        <div className={`${isCurrentEvent ? "primary" : ""}`}>
          <div>
            <b>{event.name}</b>
          </div>
          <div>
            by <b>{event.host}</b>
          </div>
        </div>
        <div className="event-description">{event.text}</div>
      </div>
      {isCurrentEvent && (
        <div className="entry-room-button">
          <a
            className="btn room-entry-button"
            onClick={() => enterRoom()}
            href={roomUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live
          </a>
        </div>
      )}
    </div>
  </div>
);

export default ScheduleItem;
