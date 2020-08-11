import React from "react";
import { formatMinute } from "utils/time";
import "./ScheduleItem.scss";
import { VenueEvent } from "types/VenueEvent";
import { WithId } from "utils/id";

interface PropsType {
  startUtcSeconds: number;
  event: WithId<VenueEvent>;
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
        <b>{formatMinute(event.start_utc_seconds, startUtcSeconds)}</b>
      </div>
      <div>
        {formatMinute(
          event.start_utc_seconds + event.duration_minutes,
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
            by <b>{"event.host HARDCODED"}</b>
          </div>
        </div>
        <div className="event-description">
          {(event.description || "").split("\n").map((p: any) => (
            <p>{p}</p>
          ))}
          {(event.descriptions || []).map((p: any) => (
            <p>{p}</p>
          ))}
        </div>
      </div>
      {isCurrentEvent && (
        <div className="entry-room-button">
          <a
            className="btn room-entry-button"
            onClick={() => enterRoom()}
            id={`enter-room-from-schedule-event-${event}`}
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
