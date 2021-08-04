import React, { useCallback } from "react";
import classNames from "classnames";
import { differenceInCalendarDays } from "date-fns";

import { EVENT_LIVE_RANGE } from "settings";

import { PersonalizedVenueEvent } from "types/venues";

import { eventEndTime, eventStartTime, isEventStartingSoon } from "utils/event";
import { formatDateRelativeToNow, formatTimeLocalised } from "utils/time";

import { useShowHide } from "hooks/useShowHide";

import Button from "components/atoms/Button";

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
  const isCurrentEventLive = isEventStartingSoon(event, 2 * EVENT_LIVE_RANGE);
  const handleCopyEventLink = useCallback(
    () => navigator.clipboard.writeText(event.venueId),
    [event.venueId]
  );

  const infoContaier = classNames("ScheduleItemNG__info", {
    "ScheduleItemNG__info--active": isCurrentEventLive,
  });

  const timeContainer = classNames("ScheduleItemNG__time", {
    "ScheduleItemNG__time--live": isCurrentEventLive,
  });

  return (
    <div className="ScheduleItemNG" onClick={toggleEventExpand}>
      {/* TODO: onClick conflict */}
      <div className={infoContaier}>
        <span className="ScheduleItemNG__date">
          {!isCurrentEventLive &&
            showDate &&
            formatDateRelativeToNow(eventStartTime(event), formatDateOptions)}
        </span>

        <span className={timeContainer}>
          {isCurrentEventLive
            ? "Live"
            : formatTimeLocalised(eventStartTime(event))}
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
          <>
            <div className="ScheduleItemNG__description">
              {event.description}
            </div>
            <div className="ScheduleItemNG__buttons">
              <Button
                customClass="ScheduleItemNG__button ScheduleItemNG__button--copy"
                onClick={handleCopyEventLink}
              >
                Copy event link
              </Button>
              <Button
                customClass="ScheduleItemNG__button"
                onClick={() => console.log(event.venueId)}
              >
                See on playa
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
