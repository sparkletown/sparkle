import React from "react";
import { differenceInCalendarDays } from "date-fns";

import { PersonalizedVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import "./ScheduleItemNG.scss";

export interface ScheduleItemNGProps {
  event: PersonalizedVenueEvent;
}

const formatDateOptions = { formatToday: () => "" };

export const ScheduleItemNG: React.FC<ScheduleItemNGProps> = ({ event }) => {
  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime(event), eventStartTime(event))
  );

  return (
    <div className="ScheduleItemNG">
      <div className="ScheduleItemNG--info">
        <span className="ScheduleItemNG--date">
          {showDate &&
            formatDateRelativeToNow(eventStartTime(event), formatDateOptions)}
        </span>

        <span className="ScheduleItemNG--time">
          {formatTimeLocalised(eventStartTime(event))}
        </span>

        <span className="ScheduleItemNG--date">
          {showDate &&
            formatDateRelativeToNow(eventEndTime(event), formatDateOptions)}
        </span>

        <span className="ScheduleItemNG--time">
          {formatTimeLocalised(eventEndTime(event))}
        </span>
      </div>
      <div className="ScheduleItemNG--name">{event.name}</div>
    </div>
  );
};
