import React from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import "./ScheduleItemNG.scss";

export interface ScheduleItemNGProps {
  event: PersonalizedVenueEvent;
}

export const ScheduleItemNG: React.FC<ScheduleItemNGProps> = ({ event }) => {
  const formatDateOptions = { formatToday: () => "" };

  return (
    <div className="ScheduleItemNG">
      <div className="ScheduleItemNG--info">
        <span className="ScheduleItemNG--date">
          {formatDateRelativeToNow(eventStartTime(event), formatDateOptions)}
        </span>

        <span className="ScheduleItemNG--time">
          {formatTimeLocalised(eventStartTime(event))}
        </span>

        <span className="ScheduleItemNG--date">
          {formatDateRelativeToNow(eventEndTime(event), formatDateOptions)}
        </span>

        <span className="ScheduleItemNG--time">
          {formatTimeLocalised(eventEndTime(event))}
        </span>
      </div>
      <div className="ScheduleItemNG--name">{event.name}</div>
    </div>
  );
};
