import React, { useCallback } from "react";
import classNames from "classnames";

import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime, isEventLive } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./ScheduleItem.scss";

interface PropsType {
  event: VenueEvent;
  enterEventLocation: () => void;
}

export const ScheduleItem: React.FunctionComponent<PropsType> = ({
  event,
  enterEventLocation,
}) => {
  const isCurrentEventLive = isEventLive(event);

  const scheduleItemClasses = classNames({
    ScheduleItem: true,
    "ScheduleItem--primary": isCurrentEventLive,
  });

  const enterEventLocationPreventDefault = useCallback(
    (e) => {
      // Ensure the <a href> doesn't cause link navigation again when onRoomEnter is already doing it
      e.preventDefault();

      enterEventLocation();
    },
    [enterEventLocation]
  );

  return (
    <div
      className={scheduleItemClasses}
      onClick={enterEventLocationPreventDefault}
    >
      <div className="ScheduleItem__event-dates">
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

        <span className="ScheduleItem__event-end-time">
          {formatTimeLocalised(eventEndTime(event))}
        </span>

        {isCurrentEventLive && (
          <div className="ScheduleItem__event-live-label">Live</div>
        )}
      </div>

      <div className="ScheduleItem__event-info">
        <div className="ScheduleItem__event-name">{event.name}</div>
        <div>
          <span className="ScheduleItem__event-host-prefix">by </span>
          <span className="ScheduleItem__event-host">{event.host}</span>
        </div>
        <div className="ScheduleItem__event-description">
          <RenderMarkdown text={event.description} />
        </div>
      </div>
    </div>
  );
};
