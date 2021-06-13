import React from "react";

import { VenueEvent } from "types/venues";

import { retainAttendance } from "store/actions/Attendance";

import { formatUtcSeconds, labelDayRoomSchedule } from "utils/time";

import { useDispatch } from "hooks/useDispatch";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./ScheduleItem.scss";

interface PropsType {
  event: VenueEvent;
  isCurrentEvent?: boolean;
  onRoomEnter: () => void;
  roomUrl: string;
}

export const ScheduleItem: React.FunctionComponent<PropsType> = ({
  event,
  isCurrentEvent,
  onRoomEnter,
  roomUrl,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="schedule-item-container">
      <div className={`time-section ${isCurrentEvent ? "primary" : ""}`}>
        <span className="event-date">
          {labelDayRoomSchedule(event.start_utc_seconds)}
        </span>
        <span className="event-time">
          {formatUtcSeconds(event.start_utc_seconds)}
        </span>
        <span className="event-time">
          {formatUtcSeconds(
            event.start_utc_seconds + event.duration_minutes * 60
          )}
        </span>
      </div>
      <div className="event-section">
        <div>
          <div className={`${isCurrentEvent ? "primary" : ""}`}>
            <span className="event-name">{event.name}</span>
            by <span className="event-host">{event.host}</span>
            <div className="event-description">
              <RenderMarkdown text={event.description} />
            </div>
          </div>
        </div>
        {isCurrentEvent && (
          <div className="entry-room-button">
            <a
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
              className="btn room-entry-button"
              onClick={onRoomEnter}
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
};
