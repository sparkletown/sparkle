import React, { useCallback, MouseEventHandler } from "react";
import { differenceInCalendarDays } from "date-fns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";

import { PersonalizedVenueEvent } from "types/venues";

import { useUser } from "hooks/useUser";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import "./ScheduleItemNG.scss";

export interface ScheduleItemNGProps {
  event: PersonalizedVenueEvent;
}

const formatDateOptions = { formatToday: () => "" };

export const ScheduleItemNG: React.FC<ScheduleItemNGProps> = ({ event }) => {
  const showDate = Boolean(
    differenceInCalendarDays(eventEndTime(event), eventStartTime(event))
  );

  const { userId } = useUser();

  const bookmarkEvent: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!userId || !event.id) return;

    event.isSaved
      ? removeEventFromPersonalizedSchedule({ event, userId })
      : addEventToPersonalizedSchedule({ event, userId });
  }, [userId, event]);

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
      <div className="ScheduleItemNG--bookmark" onClick={bookmarkEvent}>
        <FontAwesomeIcon
          icon={event.isSaved ? solidBookmark : regularBookmark}
        />
      </div>
    </div>
  );
};
