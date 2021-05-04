import React, { useState } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import { VenueEvent } from "types/venues";
import { isTruthy } from "utils/types";

import {
  getSecondsFromStartOfDay,
  ONE_HOUR_IN_SECONDS,
  isLiveEvent,
} from "utils/time";

import "./ScheduleEvent.scss";

export interface ScheduleEventProps {
  event: VenueEvent;
  scheduleStartHour: number;
  onEventBookmarked: Function;
  isUsers?: boolean;
}

const HOUR_WIDTH = 200; // px

export const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  event,
  scheduleStartHour,
  onEventBookmarked,
  isUsers,
}) => {
  const [isBookmarked, setBookmark] = useState(isTruthy(isUsers));

  const containerClasses = classNames(
    "ScheduleEvent",
    {
      "ScheduleEvent--live": isLiveEvent(
        event.start_utc_seconds,
        event.duration_minutes
      ),
    },
    { "ScheduleEvent--users": isTruthy(isUsers) }
  );

  const calcStartPosition = (startTimeUtcSeconds: number) => {
    const startTimeTodaySeconds = getSecondsFromStartOfDay(startTimeUtcSeconds);

    return (
      HOUR_WIDTH / 2 +
      (startTimeTodaySeconds / ONE_HOUR_IN_SECONDS - scheduleStartHour) *
        HOUR_WIDTH
    );
  };

  const eventWidth = (event.duration_minutes * 200) / 60;

  const bookmarkEvent = () => {
    setBookmark(!isBookmarked);
    onEventBookmarked(!isBookmarked, event);
  };

  return (
    <div
      className={containerClasses}
      style={{
        marginLeft: `${calcStartPosition(event.start_utc_seconds)}px`,
        width: `${eventWidth}px`,
      }}
    >
      <div className="ScheduleEvent__info">
        <div className="ScheduleEvent__title">{event.name}</div>
        <div className="ScheduleEvent__description">by {event.host}</div>
      </div>

      <div
        className="ScheduleEvent__bookmark"
        onClick={(e) => {
          e.stopPropagation();
          bookmarkEvent();
        }}
      >
        <FontAwesomeIcon
          icon={isBookmarked ? solidBookmark : regularBookmark}
          style={{ cursor: "pointer", width: "15px", height: "20px" }}
        />
      </div>
    </div>
  );
};
