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
    <div className="ScheduleItem">
      <div
        className={`ScheduleItem__time-section ${
          isCurrentEvent ? "ScheduleItem__primary" : ""
        }`}
      >
        <span className="ScheduleItem__event-date">
          {labelDayRoomSchedule(event.start_utc_seconds)}
        </span>
        <span className="ScheduleItem__event-time">
          {formatUtcSeconds(event.start_utc_seconds)}
        </span>
        <span className="ScheduleItem__event-time">
          {formatUtcSeconds(
            event.start_utc_seconds + event.duration_minutes * 60
          )}
        </span>
      </div>
      <div className="ScheduleItem__event-section">
        <div className={`${isCurrentEvent ? "ScheduleItem__primary" : ""}`}>
          <span className="ScheduleItem__event-name">{event.name}</span>
          by <span className="ScheduleItem__event-host">{event.host}</span>
          <span className="ScheduleItem__event-description">
            <RenderMarkdown text={event.description} />
          </span>
        </div>
        {isCurrentEvent && (
          <div className="ScheduleItem__entry-room-button">
            <a
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
              className="btn ScheduleItem__room-entry-button"
              onClick={onRoomEnter}
              id={`ScheduleItem__enter-room-from-schedule-event-${event}`}
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
