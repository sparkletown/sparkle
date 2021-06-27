import React, { useCallback } from "react";
import classNames from "classnames";

import { VenueEvent } from "types/venues";

import { retainAttendance } from "store/actions/Attendance";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";
import { externalUrlAdditionalProps } from "utils/url";

import { useDispatch } from "hooks/useDispatch";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./ScheduleItem.scss";

interface PropsType {
  event: VenueEvent;
  onRoomEnter: () => void;
  roomUrl: string;
}

export const ScheduleItem: React.FunctionComponent<PropsType> = ({
  event,
  onRoomEnter,
  roomUrl,
}) => {
  const dispatch = useDispatch();

  const isCurrentEventLive = isEventLive(event);

  const schedulePrimaryClasses = classNames({
    "ScheduleItem--primary": isCurrentEventLive,
  });

  const scheduleItemTimeSectionClasses = classNames(
    "ScheduleItem__time-section",
    schedulePrimaryClasses
  );

  const onRoomEnterPreventDefault = useCallback(
    (e) => {
      // Ensure the <a href> doesn't cause link navigation again when onRoomEnter is already doing it
      e.preventDefault();

      onRoomEnter();
    },
    [onRoomEnter]
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

        {isCurrentEventLive && (
          <div className="ScheduleItem__entry-room-button">
            {/* @debt extract this 'enter room' button/link concept into a reusable component */}
            {/* @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt? */}
            <a
              className="btn ScheduleItem__room-entry-button"
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
              onClick={onRoomEnterPreventDefault}
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
