import React from "react";
import { differenceInCalendarDays } from "date-fns";

import { PersonalizedVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { useShowHide } from "hooks/useShowHide";

import "./ScheduleItemNG.scss";

export interface ScheduleItemNGProps {
  event: PersonalizedVenueEvent;
}

const formatDateOptions = { formatToday: () => "" };

export const ScheduleItemNG: React.FC<ScheduleItemNGProps> = ({ event }) => {
  const { isShown: isEventExpanded, toggle: toggleEventExpand } = useShowHide();
  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime(event), eventStartTime(event))
  );

  return (
    <div className="ScheduleItemNG" onClick={toggleEventExpand}>
      <div className="ScheduleItemNG__info">
        <span className="ScheduleItemNG__date">
          {showDate &&
            formatDateRelativeToNow(eventStartTime(event), formatDateOptions)}
        </span>

        <span className="ScheduleItemNG__time">
          {formatTimeLocalised(eventStartTime(event))}
        </span>

        <span className="ScheduleItemNG__date ScheduleItemNG__time--end">
          {showDate &&
            formatDateRelativeToNow(eventEndTime(event), formatDateOptions)}
        </span>

        <span className="ScheduleItemNG__time ScheduleItemNG__time--end">
          {formatTimeLocalised(eventEndTime(event))}
        </span>
      </div>
      <div className="ScheduleItemNG__details">
        <div className="ScheduleItemNG__name">{event.name}</div>
        <div className="ScheduleItemNG__place">
          <span className="ScheduleItemNG__place--location">in</span>{" "}
          {event.venueId}
        </div>
        {isEventExpanded && (
          <div className="ScheduleItemNG__description">{event.description}</div>
        )}
      </div>
    </div>
  );
};
