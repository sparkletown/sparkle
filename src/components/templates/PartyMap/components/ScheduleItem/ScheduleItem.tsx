import React from "react";
import { formatMinute } from "utils/time";
import "./ScheduleItem.scss";
import { VenueEvent } from "types/VenueEvent";
import { WithId } from "utils/id";
import { PartyMapScheduleItem } from "types/PartyMapVenue";

interface PropsType {
  startUtcSeconds: number;
  scheduleItem: PartyMapScheduleItem;
  isCurrentEvent: boolean;
  enterRoom: () => void;
  roomUrl: string;
}

const ScheduleItem: React.FunctionComponent<PropsType> = ({
  startUtcSeconds,
  scheduleItem,
  isCurrentEvent,
  enterRoom,
  roomUrl,
}) => (
  <div className="shedule-item-container">
    <div className={`time-section ${isCurrentEvent ? "primary" : ""}`}>
      <div>
        <b>{formatMinute(scheduleItem.start_minute, startUtcSeconds)}</b>
      </div>
      <div>
        {formatMinute(
          scheduleItem.start_minute + scheduleItem.duration_minutes,
          startUtcSeconds
        )}
      </div>
    </div>
    <div className="event-section">
      <div>
        <div className={`${isCurrentEvent ? "primary" : ""}`}>
          <div>
            <b>{scheduleItem.name}</b>
          </div>
          <div>
            by <b>{"event.host HARDCODED"}</b>
          </div>
        </div>
        {/* <div className="event-description">
          {(scheduleItem.description || "").split("\n").map((p: any) => (
            <p>{p}</p>
          ))}
          {(scheduleItem.descriptions || []).map((p: any) => (
            <p>{p}</p>
          ))}
        </div> */}
      </div>
      {isCurrentEvent && (
        <div className="entry-room-button">
          <a
            className="btn room-entry-button"
            onClick={() => enterRoom()}
            id={`enter-room-from-schedule-event-${scheduleItem.name}`}
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
