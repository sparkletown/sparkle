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
        <div>
          <b>{labelDayRoomSchedule(event.start_utc_seconds)}</b>
        </div>
        <div>
          <b>{formatUtcSeconds(event.start_utc_seconds)}</b>
        </div>
        <div>
          {formatUtcSeconds(
            event.start_utc_seconds + event.duration_minutes * 60
          )}
        </div>
      </div>
      <div className="event-section">
        <div>
          <div className={`${isCurrentEvent ? "primary" : ""}`}>
            <div>
              <b>{event.name}</b>
            </div>
            {event.host && (
              <div>
                by <b>{event.host}</b>
              </div>
            )}
          </div>
          <div className="event-description">
            <RenderMarkdown text={event.description} />
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
