import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import { PersonalizedVenueEvent } from "types/venues";

import { WithVenueId } from "utils/id";
import { isTruthy } from "utils/types";

import { isLiveEvent, ONE_HOUR_IN_MINUTES } from "utils/time";

import { saveEventToProfile } from "api/profile";
import { useUser } from "hooks/useUser";

import { calcStartPosition, HOUR_WIDTH } from "../Schedule/Schedule.utils";

import "./ScheduleEvent.scss";

export interface ScheduleEventProps {
  event: WithVenueId<PersonalizedVenueEvent>;
  scheduleStartHour: number;
  isUsers?: boolean;
}

export const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  event,
  scheduleStartHour,
  isUsers,
}) => {
  const [isBookmarked, setBookmark] = useState(event.isSaved);

  useEffect(() => {
    setBookmark(event.isSaved);
  }, [event.isSaved]);

  const { userId } = useUser();

  const containerClasses = useMemo(
    () =>
      classNames(
        "ScheduleEvent",
        {
          "ScheduleEvent--live": isLiveEvent(
            event.start_utc_seconds,
            event.duration_minutes
          ),
        },
        { "ScheduleEvent--users": isTruthy(isUsers) }
      ),
    [event, isUsers]
  );

  const eventWidth = useMemo(
    () => (event.duration_minutes * HOUR_WIDTH) / ONE_HOUR_IN_MINUTES,
    [event]
  );
  const bookmarkEvent = useCallback(() => {
    event.isSaved = !event.isSaved;

    if (userId && event.id) {
      saveEventToProfile({
        venueId: event.venueId,
        userId: userId,
        removeMode: !event.isSaved,
        eventId: event.id,
      });
    }
  }, [userId, event]);

  const onBookmark: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      bookmarkEvent();
    },
    [bookmarkEvent]
  );

  return (
    <div
      className={containerClasses}
      style={{
        marginLeft: `${calcStartPosition(
          event.start_utc_seconds,
          scheduleStartHour
        )}px`,
        width: `${eventWidth}px`,
      }}
    >
      <div className="ScheduleEvent__info">
        <div className="ScheduleEvent__title">{event.name}</div>
        <div className="ScheduleEvent__description">by {event.host}</div>
      </div>

      <div className="ScheduleEvent__bookmark" onClick={onBookmark}>
        <FontAwesomeIcon
          icon={isBookmarked ? solidBookmark : regularBookmark}
        />
      </div>
    </div>
  );
};
