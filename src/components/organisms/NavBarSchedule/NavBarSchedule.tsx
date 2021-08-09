import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import {
  addDays,
  differenceInDays,
  format,
  fromUnixTime,
  getUnixTime,
  isToday,
  max,
  millisecondsToSeconds,
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
  getEventDayRange,
  isEventLiveOrFuture,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithVenueId } from "utils/id";
import { range } from "utils/range";
import { formatDateRelativeToNow, isDateLessOrEqualsToday } from "utils/time";

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
const todaysDate = new Date();
const todaysDateTime = new Date().getTime();

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

  const liveAndFutureEvents = useMemo(
    () => relatedVenueEvents.filter(isEventLiveOrFuture),
    [relatedVenueEvents]
  );
  const hasSavedEvents = liveAndFutureEvents
    .map(
      prepareForSchedule({
        usersEvents: userEventIds,
      })
    )
    .filter((event) => event.isSaved).length;

  const isShowPersonalDownloadBtn = hasSavedEvents && showPersonalisedSchedule;
  const liveEventsMinimalStartValue = Math.min(
    ...liveAndFutureEvents.map((event) => event.start_utc_seconds)
  );

  const firstLiveEvent = liveAndFutureEvents.find(
    (event) => event.start_utc_seconds === liveEventsMinimalStartValue
  );

  const minDate = useMemo(
    () =>
      firstLiveEvent
        ? isEventLiveOrFuture(firstLiveEvent)
          ? new Date(liveEventsMinimalStartValue).getTime()
          : millisecondsToSeconds(todaysDateTime)
        : minRangeValue,
    [firstLiveEvent, liveEventsMinimalStartValue]
  );

  const firstRangeDayTimeValue = isDateLessOrEqualsToday({
    dateValue: secondsToMilliseconds(minDate),
    targetDateValue: millisecondsToSeconds(startOfToday().getTime()),
  });

  const firstRangeDateInSeconds = getUnixTime(
    max([
      new Date(secondsToMilliseconds(minDate)).getTime(),
      todaysDate.getTime(),
    ])
  );

  const maxDate = useMemo(
    () =>
      Math.max(
        ...liveAndFutureEvents.map(
          (event) =>
            event.start_utc_seconds + minutesToSeconds(event.duration_minutes)
        ),
        // + 1 is needed to form a `daysInBetween` timeline and mitigate possible range error
        firstRangeDateInSeconds + 1
      ),
    [liveAndFutureEvents, firstRangeDateInSeconds]
  );

  const daysInBetween = differenceInDays(
    fromUnixTime(maxDate),
    fromUnixTime(firstRangeDateInSeconds)
  );
  const dayDifference = getEventDayRange(daysInBetween);

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
      const firstScheduleDate = firstRangeDayTimeValue
        ? todaysDate
        : new Date(secondsToMilliseconds(minDate));
      const day = addDays(firstScheduleDate, dayIndex);

      const daysWithEvents = liveAndFutureEvents.some(
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
    liveAndFutureEvents,
    minDate,
    firstRangeDayTimeValue,
  ]);

  const scheduleNG: ScheduleNGDay = useMemo(() => {
    const firstScheduleDate = firstRangeDayTimeValue
      ? todaysDate
      : new Date(secondsToMilliseconds(minDate));
    const day = addDays(firstScheduleDate, selectedDayIndex);

    const daysEvents = liveAndFutureEvents
      .filter(isEventWithinDateAndNotFinished(day))
      .sort(eventTimeComparator)
      .map(
        prepareForSchedule({
          usersEvents: userEventIds,
        })
      );
    return {
      scheduleDate: day,
      daysEvents: showPersonalisedSchedule
        ? daysEvents.filter((event) => event.isSaved)
        : daysEvents,
    };
  }, [
    liveAndFutureEvents,
    userEventIds,
    selectedDayIndex,
    minDate,
    showPersonalisedSchedule,
    firstRangeDayTimeValue,
  ]);

  const downloadPersonalEventsCalendar = useCallback(() => {
    const allPersonalEvents: PersonalizedVenueEvent[] = liveAndFutureEvents
      .map(
        prepareForSchedule({
          usersEvents: userEventIds,
        })
      )
      .filter((event) => event.isSaved);

    downloadCalendar({
      calendar: createCalendar({ events: allPersonalEvents }),
      calendarName: `${PLATFORM_BRAND_NAME}_Personal`,
    });
  }, [userEventIds, liveAndFutureEvents]);

  const downloadAllEventsCalendar = useCallback(() => {
    downloadCalendar({
      calendar: createCalendar({ events: liveAndFutureEvents }),
      calendarName: `${PLATFORM_BRAND_NAME}_Full`,
    });
  }, [liveAndFutureEvents]);

  const containerClasses = classNames("NavBarSchedule", {
    "NavBarSchedule--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      {/* Disabled as per designs. Up for deletion if confirmied not necessary */}
      {/* {venueId && <ScheduleVenueDescription venueId={venueId} />} */}
      {!isLoadingSchedule && (
        <div className="NavBarSchedule__download-buttons">
          {isShowPersonalDownloadBtn ? (
            <Button
              onClick={downloadPersonalEventsCalendar}
              customClass="NavBarSchedule__download-schedule-btn"
            >
              Download your schedule
            </Button>
          ) : null}
          <Button
            onClick={downloadAllEventsCalendar}
            customClass="NavBarSchedule__download-schedule-btn"
          >
            Download full schedule
          </Button>
        </div>
      )}

      <ul className="NavBarSchedule__weekdays">{weekdays}</ul>
      <Toggler
        containerClassName="NavBarSchedule__bookmarked-toggle"
        name="bookmarked-toggle"
        toggled={showPersonalisedSchedule}
        onChange={togglePersonalisedSchedule}
        label="Bookmarked events"
      />
      <ScheduleNG
        showPersonalisedSchedule={showPersonalisedSchedule}
        isLoading={isLoadingSchedule}
        {...scheduleNG}
      />
    </div>
  );
};
