import React, {
  RefObject,
  MouseEventHandler,
  useCallback,
  useRef,
} from "react";
import classNames from "classnames";
import { useCss } from "react-use";
import { minutesToHours } from "date-fns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as solidBookmark,
  faExpandAlt as solidExpand,
  faCompressAlt as solidCompress,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as regularBookmark,
  faSquare as regularSquare,
} from "@fortawesome/free-regular-svg-icons";

import {
  SCHEDULE_HOUR_COLUMN_WIDTH_PX,
  SCHEDULE_SHORT_EVENT_LENGTH_MIN,
  SCHEDULE_LONG_EVENT_LENGTH_MIN,
} from "settings";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { PersonalizedVenueEvent } from "types/venues";

import { isEventLive } from "utils/event";

import { useUser } from "hooks/useUser";
import { useShowHide } from "hooks/useShowHide";

import { EventModal } from "components/organisms/EventModal";
import { calcStartPosition } from "components/molecules/Schedule/utils";

import "./ScheduleEvent.scss";

const ScheduleEventBookmarkClass = "ScheduleEvent__bookmark";
const ScheduleEventExpandClass = "ScheduleEvent__expand";

export interface ScheduleEventProps {
  event: PersonalizedVenueEvent;
  scheduleStartHour: number;
  personalizedEvent?: boolean;
}

export const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  event,
  scheduleStartHour,
  personalizedEvent: isPersonalizedEvent = false,
}) => {
  const eventRef: RefObject<HTMLDivElement> = useRef(null);

  const { userId } = useUser();
  const {
    isShown: isExpanded,
    hide: hideExpanded,
    show: showExpanded,
  } = useShowHide();

  const eventWidthPx = minutesToHours(
    event.duration_minutes * SCHEDULE_HOUR_COLUMN_WIDTH_PX
  );

  const expandedEventPx =
    minutesToHours(SCHEDULE_LONG_EVENT_LENGTH_MIN) *
    SCHEDULE_HOUR_COLUMN_WIDTH_PX;

  const eventMarginLeftPx = calcStartPosition(
    event.start_utc_seconds,
    scheduleStartHour
  );

  const containerCssVars = useCss({
    "--event--margin-left": `${eventMarginLeftPx}px`,
    "--event--width": `${eventWidthPx}px`,
    "--event--expanded-width": `${expandedEventPx}px`,
  });

  const isMinimallyLongEvent =
    event.duration_minutes >= SCHEDULE_LONG_EVENT_LENGTH_MIN;
  const isShortEvent =
    event.duration_minutes <= SCHEDULE_SHORT_EVENT_LENGTH_MIN;
  const isEventLong = event.duration_minutes >= SCHEDULE_LONG_EVENT_LENGTH_MIN;

  const isLongEventExpanded = !isShortEvent || isExpanded;
  const isBookmarkDisplayed = isMinimallyLongEvent || isExpanded;
  const isContentDisplayed = isExpanded || isEventLong;
  const isShowExpand = isLongEventExpanded && !isEventLong;

  const containerClasses = classNames(
    "ScheduleEvent",
    {
      "ScheduleEvent--live": isEventLive(event),
      "ScheduleEvent--users": isPersonalizedEvent,
      "ScheduleEvent--expanded": isExpanded,
    },
    containerCssVars
  );

  const expandClasses = classNames("ScheduleEvent__expand", {
    "ScheduleEvent__expand--hidden": !isShowExpand,
    "ScheduleEvent__expand--marged": !isExpanded && !isEventLong,
    "ScheduleEvent__expand--padded": isContentDisplayed,
    "ScheduleEvent__expand--live": isEventLive(event),
  });

  const bookmarkClasses = classNames("ScheduleEvent__bookmark", {
    "ScheduleEvent__bookmark--hidden": !isBookmarkDisplayed,
  });

  const contentClasses = classNames("ScheduleEvent__info", {
    "ScheduleEvent__info--hidden": !isContentDisplayed,
  });

  const bookmarkEvent: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    if (!userId || !event.id) return;

    event.isSaved
      ? removeEventFromPersonalizedSchedule({ event, userId })
      : addEventToPersonalizedSchedule({ event, userId });
  }, [userId, event]);

  const {
    isShown: isEventModalVisible,
    show: showEventModal,
    hide: hideEventModal,
  } = useShowHide();

  const onEventBoxClick = useCallback(
    (e) => {
      if (
        e.target.closest(`.${ScheduleEventBookmarkClass}`) ||
        e.target.closest(`.${ScheduleEventExpandClass}`)
      )
        return;

      showEventModal();
    },
    [showEventModal]
  );

  const handleMouseOver = useCallback(() => {
    if (isMinimallyLongEvent) return;

    showExpanded();
  }, [isMinimallyLongEvent, showExpanded]);

  const handleMouseOut = useCallback(() => {
    hideExpanded();
  }, [hideExpanded]);

  return (
    <>
      <div
        ref={eventRef}
        className={containerClasses}
        onClick={onEventBoxClick}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      >
        <button className={expandClasses}>
          <FontAwesomeIcon
            icon={regularSquare}
            className="ScheduleEvent__expand--square"
          />
          <FontAwesomeIcon
            icon={isExpanded ? solidCompress : solidExpand}
            className="ScheduleEvent__expand--arrows"
          />
        </button>

        <div className={contentClasses}>
          <div className="ScheduleEvent__title">{event.name}</div>
          <div className="ScheduleEvent__host">by {event.host}</div>
        </div>

        <div className={bookmarkClasses} onClick={bookmarkEvent}>
          <FontAwesomeIcon
            icon={event.isSaved ? solidBookmark : regularBookmark}
          />
        </div>
      </div>

      <EventModal
        show={isEventModalVisible}
        onHide={hideEventModal}
        event={event}
      />
    </>
  );
};
