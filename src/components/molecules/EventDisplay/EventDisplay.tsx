import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import classNames from "classnames";

import { AnyVenue, VenueEvent } from "types/venues";

import { getCurrentTimeInUTCSeconds, formatHour } from "utils/time";
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
  const duration = Math.floor(event.duration_minutes / 60);

  return (
    <div
      className={containerClasses}
      style={{
        marginLeft: `${Number(starHour) * 200 + 280}px`,
        width: `${
          Number(starHour) * 200 + 100 + duration * 200 > 4800
            ? 4800 - (Number(starHour) * 200 + 100)
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
