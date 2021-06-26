import React from "react";
import classNames from "classnames";

import { VenueEvent } from "types/venues";

import { retainAttendance } from "store/actions/Attendance";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";
import { externalUrlAdditionalProps } from "utils/url";

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
          {formatDateRelativeToNow(eventStartTime(event), {
            formatToday: () => "",
          })}
        </span>
        <span className="ScheduleItem__event-time">
          {formatTimeLocalised(eventStartTime(event))}
        </span>
        <span className="ScheduleItem__event-date">
          {formatDateRelativeToNow(eventEndTime(event), {
            formatToday: () => "",
          })}
        </span>
        <span className="ScheduleItem__event-time">
          {formatTimeLocalised(eventEndTime(event))}
        </span>
      </div>
      <div className="ScheduleItem__event-section">
        <div className={schedulePrimaryClasses}>
          <div className="ScheduleItem__event-name">{event.name}</div>
          by <span className="ScheduleItem__event-host">{event.host}</span>
          <div className="ScheduleItem__event-description">
            <RenderMarkdown text={event.description} />
          </div>
        </div>

        {isCurrentEvent && (
          <div className="ScheduleItem__entry-room-button">
            <a
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
              className="btn ScheduleItem__room-entry-button"
              onClick={onRoomEnter}
              href={roomUrl}
              {...externalUrlAdditionalProps}
            >
              Live
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
