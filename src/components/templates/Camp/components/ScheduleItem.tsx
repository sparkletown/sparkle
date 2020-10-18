import React from "react";
import { formatUtcSeconds } from "utils/time";
import { VenueEvent } from "types/VenueEvent";

import "../../../templates/PartyMap/components/ScheduleItem/ScheduleItem.scss";
import { useDispatch } from "hooks/useDispatch";
import { retainAttendance } from "store/actions/Attendance";

interface PropsType {
  event: VenueEvent;
  isCurrentEvent?: boolean;
  enterRoom: () => void;
  roomUrl: string;
}

export const ScheduleItem: React.FunctionComponent<PropsType> = ({
  event,
  isCurrentEvent,
  enterRoom,
  roomUrl,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="shedule-item-container">
      <div className={`time-section ${isCurrentEvent ? "primary" : ""}`}>
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
            <div>
              by <b>{event.host}</b>
            </div>
          </div>
          <div className="event-description">{event.description}</div>
        </div>
        {isCurrentEvent && (
          <div className="entry-room-button">
            <a
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
              className="btn room-entry-button"
              onClick={enterRoom}
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
