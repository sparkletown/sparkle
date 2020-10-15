import { useDispatch } from "hooks/useDispatch";
import React from "react";
import { retainAttendance } from "store/actions/Attendance";
import { RoomEventData } from "types/RoomEventData";
import { formatMinute } from "utils/time";
import "./ScheduleItem.scss";

interface PropsType {
  startUtcSeconds: number;
  event: RoomEventData[0];
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
}) => {
  const dispatch = useDispatch();
  return (
    <div className="shedule-item-container">
      <div className={`time-section ${isCurrentEvent ? "primary" : ""}`}>
        <div>
          <b>{formatMinute(event.start_minute, startUtcSeconds)}</b>
        </div>
        <div>
          {formatMinute(
            event.start_minute + event.duration_minutes,
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
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
              className="btn room-entry-button"
              onClick={enterRoom}
              id={`enter-room-from-schedule-event-${event}`}
              href={roomUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              On Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleItem;
