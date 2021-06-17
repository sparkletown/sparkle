import React from "react";
import classNames from "classnames";
import { fromUnixTime } from "date-fns";

import { VenueEvent } from "types/venues";

import { retainAttendance } from "store/actions/Attendance";

import { eventEndTime, eventStartTime } from "utils/event";
import {
  formatDateRelativeToNow,
  formatTimestampToDisplayHoursMinutes,
} from "utils/time";

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

  const schedulePrimaryClasses = classNames({
    "ScheduleItem--primary": isCurrentEvent,
  });

  const scheduleItemTimeSectionClasses = classNames(
    "ScheduleItem__time-section",
    schedulePrimaryClasses
  );

  return (
    <div className="ScheduleItem">
      <div className={scheduleItemTimeSectionClasses}>
        <span className="ScheduleItem__event-date">
          {formatDateRelativeToNow(fromUnixTime(event.start_utc_seconds), {
            formatToday: () => "",
          })}
        </span>
        <span className="ScheduleItem__event-time">
          {formatTimestampToDisplayHoursMinutes(eventStartTime(event))}
        </span>
        <span className="ScheduleItem__event-time">
          {formatTimestampToDisplayHoursMinutes(eventEndTime(event))}
        </span>
      </div>
      <div className="ScheduleItem__event-section">
        <div className={schedulePrimaryClasses}>
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
