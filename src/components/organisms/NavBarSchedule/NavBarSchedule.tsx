import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import {
  addDays,
  format,
  fromUnixTime,
  isToday,
  millisecondsToHours,
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
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

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

  const {
    isShown: showPersonalisedSchedule,
    toggle: togglePersonalisedSchedule,
  } = useShowHide(false);

  const { minDate, maxDate } = relatedVenueEvents.reduce(
    (resultObj, event) => {
      if (resultObj.minDate === 0 || resultObj.maxDate === 0) {
        resultObj.minDate =
          resultObj.minDate === 0 ? event.start_utc_seconds : resultObj.minDate;

        const secondsLength = minutesToSeconds(event.duration_minutes);
        resultObj.maxDate =
          resultObj.maxDate === 0
            ? event.start_utc_seconds + secondsLength
            : resultObj.maxDate;
      }

      if (event.start_utc_seconds < resultObj.minDate) {
        resultObj.minDate = event.start_utc_seconds;
      }

      if (
        event.start_utc_seconds + minutesToSeconds(event.duration_minutes) >
        resultObj.maxDate
      ) {
        const secondsLength = minutesToSeconds(event.duration_minutes);

        resultObj.maxDate = event.start_utc_seconds + secondsLength;
      }

      return resultObj;
    },
    { minDate: 0, maxDate: 0 }
  );
  const milisecondStart = new Date(secondsToMilliseconds(minDate)).getTime();
  const milisecondFinish = new Date(secondsToMilliseconds(maxDate)).getTime();
  const dayDifference = Math.round(
    millisecondsToHours(milisecondFinish - milisecondStart) / 24
  );

  const weekdays = useMemo(() => {
    const formatDayLabel = (day: Date | number) => {
      if (isScheduleTimeshifted) {
        return format(day, "do");
      } else {
        return formatDateRelativeToNow(day, {
          formatOtherDate: (dateOrTimestamp) =>
            format(dateOrTimestamp, "do"),
          formatTomorrow: (dateOrTimestamp) =>
            format(dateOrTimestamp, "do"),
        });
      }
    };

    return range(dayDifference).map((dayIndex) => {
      const day = addDays(firstDayOfSchedule, dayIndex);

      const daysWithEvents = relatedVenueEvents.filter(
        isScheduleTimeshifted
          ? isEventWithinDate(day)
          : isEventWithinDateAndNotFinished(day)
      );

      const classes = classNames("NavBarSchedule__weekday", {
        "NavBarSchedule__weekday--active": dayIndex === selectedDayIndex,
        "NavBarSchedule__weekday--disabled": !daysWithEvents.length,
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
    firstDayOfSchedule,
    isScheduleTimeshifted,
    dayDifference,
    relatedVenueEvents,
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
      {venueId && <ScheduleVenueDescription venueId={venueId} />}
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
