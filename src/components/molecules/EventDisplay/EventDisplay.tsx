import React, { useState, useMemo } from "react";
import { format } from "date-fns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import classNames from "classnames";

import { AnyVenue, VenueEvent } from "types/venues";

import { getCurrentTimeInUTCSeconds, formatHour, getMinutes } from "utils/time";
import { WithId } from "utils/id";

import "./EventDisplay.scss";

export interface EventDisplayProps {
  event: VenueEvent;
  venue?: WithId<AnyVenue>;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event, venue }) => {
  const [isBookmarked, setBookmark] = useState(false);

  const isLiveEvent =
    event.start_utc_seconds < getCurrentTimeInUTCSeconds() &&
    event.start_utc_seconds + event.duration_minutes * 60 >
      getCurrentTimeInUTCSeconds();

  const containerClasses = classNames("schedule-event-container", {
    "schedule-event-container--live": isLiveEvent,
  });

  const starHour = formatHour(event.start_utc_seconds);

  const oneHourBehind = format(
    new Date().setHours(new Date().getHours() - 1),
    "HH"
  );
  const duration = Math.floor(event.duration_minutes / 60);
  const beginnigToShow = Number(starHour) - Number(oneHourBehind);

  const currentMinutes = getMinutes(getCurrentTimeInUTCSeconds());

  const timeToShow = useMemo(() => {
    const minutesShowing =
      currentMinutes >= 1020 ? 1020 : (new Date().getHours() - 1) * 60;
    const startTime = getMinutes(event.start_utc_seconds);

    return startTime - minutesShowing;
  }, [currentMinutes, event.start_utc_seconds]);

  return (
    <div
      className={containerClasses}
      style={{
        marginLeft: `${timeToShow * 3.33 + 90}px`,
        width: `${
          beginnigToShow * 200 + 100 + duration * 200 > 4800
            ? 4800 - (Number(beginnigToShow) * 200 + 100)
            : duration * 200
        }px`,
      }}
    >
      <div className="schedule-event-info">
        <div className="schedule-event-info-title">{event.name}</div>
        <div className="schedule-event-info-description">by {event.host}</div>
      </div>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setBookmark(!isBookmarked);
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
