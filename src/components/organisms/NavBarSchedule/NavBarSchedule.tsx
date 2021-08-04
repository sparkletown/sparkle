import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import {
  addDays,
  differenceInDays,
  format,
  fromUnixTime,
  isToday,
  minutesToSeconds,
  secondsToMilliseconds,
  startOfDay,
  startOfToday,
} from "date-fns";

import { PLATFORM_BRAND_NAME } from "settings";

import {
  PersonalizedVenueEvent,
  VenueEvent,
} from "types/venues";

import { createCalendar, downloadCalendar } from "utils/calendar";
import {
  eventTimeComparator,
  isEventWithinDate,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithVenueId } from "utils/id";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useVenueEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { ScheduleNG } from "components/molecules/ScheduleNG";

// Disabled as per designs. Up for deletion if confirmied not necessary
// import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";
import { Button } from "components/atoms/Button";
import { Toggler } from "components/atoms/Toggler";

import { prepareForSchedule } from "./utils";

import "./NavBarSchedule.scss";

const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];

export interface ScheduleNGDay {
  daysEvents: PersonalizedVenueEvent[];
  scheduleDate: Date;
}

export const emptyPersonalizedSchedule = {};
export interface NavBarScheduleProps {
  isVisible?: boolean;
  venueId: string;
}

const minRangeValue = 0;
const maxRangeValue = 1;

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

  // @debt: probably will need to be re-calculated based on minDate instead of startOfDay.Check later
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

  const {
    isShown: showPersonalisedSchedule,
    toggle: togglePersonalisedSchedule,
  } = useShowHide(false);

  const minDate = useMemo(() => {
    if (relatedVenueEvents.length) {
      return Math.min(
        ...relatedVenueEvents.map((event) =>
          secondsToMilliseconds(
            event.start_utc_seconds + minutesToSeconds(event.duration_minutes)
          ) > startOfToday().getTime()
            ? event.start_utc_seconds
            : Number.MAX_SAFE_INTEGER
        )
      );
    }
    return minRangeValue;
  }, [relatedVenueEvents]);

  const maxDate = useMemo(() => {
    if (relatedVenueEvents.length) {
      return Math.max(
        ...relatedVenueEvents.map(
          (event) =>
            event.start_utc_seconds + minutesToSeconds(event.duration_minutes)
        )
      );
    }
    return maxRangeValue;
  }, [relatedVenueEvents]);

  const dayDifference = differenceInDays(
    fromUnixTime(maxDate),
    fromUnixTime(minDate)
  );
  const weekdays = useMemo(() => {
    const formatDayLabel = (day: Date | number) => {
      if (isScheduleTimeshifted) {
        return format(day, "do");
      } else {
        return formatDateRelativeToNow(day, {
          formatOtherDate: (dateOrTimestamp) => format(dateOrTimestamp, "do"),
          formatTomorrow: (dateOrTimestamp) => format(dateOrTimestamp, "do"),
        });
      }
    };

    return range(dayDifference).map((dayIndex) => {
      const day = addDays(minDate, dayIndex);

      const daysWithEvents = relatedVenueEvents.some(
        isEventWithinDateAndNotFinished(day)
      );

      const classes = classNames("NavBarSchedule__weekday", {
        "NavBarSchedule__weekday--active": dayIndex === selectedDayIndex,
        "NavBarSchedule__weekday--disabled": !daysWithEvents,
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
  }, [
    selectedDayIndex,
    isScheduleTimeshifted,
    dayDifference,
    relatedVenueEvents,
    minDate,
  ]);

  const scheduleNG: ScheduleNGDay = useMemo(() => {
    const startOfSelectedDay = addDays(firstDayOfSchedule, selectedDayIndex);

    const daysEvents = relatedVenueEvents
      .filter(
        isScheduleTimeshifted
          ? isEventWithinDate(startOfSelectedDay)
          : isEventWithinDateAndNotFinished(startOfSelectedDay)
      )
      .sort(eventTimeComparator)
      .map(
        prepareForSchedule({
          usersEvents: userEventIds,
        })
      );

    return {
      scheduleDate: startOfSelectedDay,
      daysEvents: showPersonalisedSchedule
        ? daysEvents.filter((event) => event.isSaved)
        : daysEvents,
    };
  }, [
    relatedVenueEvents,
    userEventIds,
    selectedDayIndex,
    firstDayOfSchedule,
    isScheduleTimeshifted,
    showPersonalisedSchedule,
  ]);

  // const downloadPersonalEventsCalendar = useCallback(() => {
  //   const dayStart = addDays(startOfToday(), selectedDayIndex);
  //   const allPersonalEvents: PersonalizedVenueEvent[] = relatedVenueEvents
  //     .map(
  //       prepareForSchedule({
  //         day: dayStart,
  //         usersEvents: userEventIds,
  //         isForCalendarFile: true,
  //       })
  //     )
  //     .filter((event) => event.isSaved);

  //   downloadCalendar({
  //     calendar: createCalendar({ events: allPersonalEvents }),
  //     calendarName: `${PLATFORM_BRAND_NAME}_Personal`,
  //   });
  // }, [relatedVenueEvents, userEventIds, selectedDayIndex]);

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
      {/* Disabled as per designs. Up for deletion if confirmied not necessary */}
      {/* {venueId && <ScheduleVenueDescription venueId={venueId} />} */}
      {!isLoadingSchedule && (
        <div className="NavBarSchedule__download-buttons">
          {/* Enable when Schedule V3 bookmarked events are ready */}
          {/* {hasSavedEvents && (
            <Button
              onClick={downloadPersonalEventsCalendar}
              customClass="NavBarSchedule__download-schedule-btn"
            >
              Download your schedule
            </Button>
          )} */}

          <Button
            onClick={downloadAllEventsCalendar}
            customClass="NavBarSchedule__download-schedule-btn"
          >
            Download full schedule
          </Button>
        </div>
      )}

      <Toggler
        containerClassName="NavBarSchedule__bookmarked-toggle"
        name="bookmarked-toggle"
        toggled={showPersonalisedSchedule}
        onChange={togglePersonalisedSchedule}
        label="Bookmarked events"
      />

      <ul className="NavBarSchedule__weekdays">{weekdays}</ul>

      <ScheduleNG
        showPersonalisedSchedule={showPersonalisedSchedule}
        isLoading={isLoadingSchedule}
        {...scheduleNG}
      />
    </div>
  );
};
