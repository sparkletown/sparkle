import React, { useCallback, useMemo, useState } from "react";
import {
  addDays,
  format,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
} from "date-fns";
import classNames from "classnames";

import { PLATFORM_BRAND_NAME, SCHEDULE_SHOW_DAYS_AHEAD } from "settings";

import {
  LocationEvents,
  PersonalizedVenueEvent,
  VenueEvent,
} from "types/venues";

import { createCalendar, downloadCalendar } from "utils/calendar";
import {
  isEventWithinDate,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithVenueId } from "utils/id";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";
import { useVenueEvents } from "hooks/events";

import { Button } from "components/atoms/Button";
import { ScheduleNG } from "components/molecules/ScheduleNG";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import { prepareForSchedule } from "./utils";

import "./NavBarSchedule.scss";

const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];

export interface ScheduleDay {
  isToday: boolean;
  scheduleDate: Date;
  locatedEvents: LocationEvents[];
  personalEvents: PersonalizedVenueEvent[];
}

export interface ScheduleNGDay {
  daysEvents: PersonalizedVenueEvent[];
}

export const emptyPersonalizedSchedule = {};
export interface NavBarScheduleProps {
  isVisible?: boolean;
  venueId: string;
}

export const NavBarSchedule: React.FC<NavBarScheduleProps> = ({
  isVisible,
  venueId,
}) => {
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const { isLoading, relatedVenueIds, sovereignVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const scheduledStartDate = sovereignVenue?.start_utc_seconds;

  const firstDayOfSchedule = useMemo(() => {
    return scheduledStartDate
      ? startOfDay(fromUnixTime(scheduledStartDate))
      : startOfToday();
  }, [scheduledStartDate]);

  const isScheduleTimeshifted = !isToday(firstDayOfSchedule);

  const {
    isEventsLoading,
    events: relatedVenueEvents = emptyRelatedEvents,
  } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const isLoadingSchedule = isLoading || isEventsLoading;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const weekdays = useMemo(() => {
    const formatDayLabel = (day: Date | number) => {
      if (isScheduleTimeshifted) {
        return format(day, "E, LLL d");
      } else {
        return formatDateRelativeToNow(day, {
          formatOtherDate: (dateOrTimestamp) => format(dateOrTimestamp, "E"),
        });
      }
    };

    return range(SCHEDULE_SHOW_DAYS_AHEAD).map((dayIndex) => {
      const day = addDays(firstDayOfSchedule, dayIndex);
      const classes = classNames("NavBarSchedule__weekday", {
        "NavBarSchedule__weekday--active": dayIndex === selectedDayIndex,
      });

      const formattedDay = formatDayLabel(day);

      return (
        <li
          key={day.toISOString()}
          className={classes}
          onClick={() => {
            setSelectedDayIndex(dayIndex);
          }}
        >
          <button
            aria-label={formattedDay}
            className="NavBarSchedule__weekday-button"
          >
            {formattedDay}
          </button>
        </li>
      );
    });
  }, [selectedDayIndex, firstDayOfSchedule, isScheduleTimeshifted]);

  const scheduleNG: ScheduleNGDay = useMemo(() => {
    const startOfSelectedDay = addDays(firstDayOfSchedule, selectedDayIndex);
    const prioritiseEvents = (
      a: WithVenueId<VenueEvent>,
      b: WithVenueId<VenueEvent>
    ) => {
      if (a.start_utc_seconds !== b.start_utc_seconds) {
        return a.start_utc_seconds - b.start_utc_seconds;
      }

      return a.duration_minutes - b.duration_minutes;
    };

    const daysEvents = relatedVenueEvents
      .filter(
        isScheduleTimeshifted
          ? isEventWithinDate(startOfSelectedDay)
          : isEventWithinDateAndNotFinished(startOfSelectedDay)
      )
      .sort(prioritiseEvents)
      .map(
        prepareForSchedule({
          day: startOfSelectedDay,
          usersEvents: userEventIds,
        })
      );

    return {
      daysEvents,
    };
  }, [
    relatedVenueEvents,
    userEventIds,
    selectedDayIndex,
    firstDayOfSchedule,
    isScheduleTimeshifted,
  ]);

  const hasSavedEvents = scheduleNG.daysEvents.length > 0;

  const downloadPersonalEventsCalendar = useCallback(() => {
    const dayStart = addDays(startOfToday(), selectedDayIndex);
    const allPersonalEvents: PersonalizedVenueEvent[] = relatedVenueEvents
      .map(
        prepareForSchedule({
          day: dayStart,
          usersEvents: userEventIds,
          isForCalendarFile: true,
        })
      )
      .filter((event) => event.isSaved);

    downloadCalendar({
      calendar: createCalendar({ events: allPersonalEvents }),
      calendarName: `${PLATFORM_BRAND_NAME}_Personal`,
    });
  }, [relatedVenueEvents, userEventIds, selectedDayIndex]);

  const downloadAllEventsCalendar = useCallback(() => {
    downloadCalendar({
      calendar: createCalendar({ events: relatedVenueEvents }),
      calendarName: `${PLATFORM_BRAND_NAME}_Full`,
    });
  }, [relatedVenueEvents]);

  const containerClasses = classNames("NavBarSchedule", {
    "NavBarSchedule--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      {venueId && <ScheduleVenueDescription venueId={venueId} />}
      {!isLoadingSchedule && (
        <div className="NavBarSchedule__download-buttons">
          {hasSavedEvents && (
            <Button
              onClick={downloadPersonalEventsCalendar}
              customClass="NavBarSchedule__download-schedule-btn"
            >
              Download your schedule
            </Button>
          )}

          <Button
            onClick={downloadAllEventsCalendar}
            customClass="NavBarSchedule__download-schedule-btn"
          >
            Download full schedule
          </Button>
        </div>
      )}
      <ul className="NavBarSchedule__weekdays">{weekdays}</ul>

      <ScheduleNG isLoading={isLoadingSchedule} {...scheduleNG} />
    </div>
  );
};
