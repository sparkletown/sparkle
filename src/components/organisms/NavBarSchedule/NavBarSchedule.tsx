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

import { ScheduledVenueEvent, VenueEvent } from "types/venues";

import { createCalendar, downloadCalendar } from "utils/calendar";
import {
  eventTimeAndOrderComparator,
  getEventDayRange,
  isEventLiveOrFuture,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithVenueId } from "utils/id";
import { range } from "utils/range";
import {
  formatDateRelativeToNow,
  isDateRangeStartWithinToday,
} from "utils/time";
import { getLastUrlParam, getUrlWithoutTrailingSlash } from "utils/url";

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
  daysEvents: ScheduledVenueEvent[];
  scheduleDate: Date;
}

export const emptyPersonalizedSchedule = {};
export interface NavBarScheduleProps {
  isVisible?: boolean;
  venueId: string;
}

const minRangeValue = 0;
const todaysDate = new Date();

export const NavBarSchedule: React.FC<NavBarScheduleProps> = ({
  isVisible,
  venueId,
}) => {
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const {
    isLoading,
    relatedVenueIds,
    sovereignVenue,
    currentVenue,
    relatedVenues,
  } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const venueRoomTitle = useMemo(
    () =>
      sovereignVenue?.rooms?.find((room) => {
        const [roomName] = getLastUrlParam(
          getUrlWithoutTrailingSlash(room.url)
        );
        return roomName === venueId;
      }),
    [sovereignVenue, venueId]
  )?.title;

  const scheduledStartDate = sovereignVenue?.start_utc_seconds;

  // @debt: probably will need to be re-calculated based on minDateUtcSeconds instead of startOfDay.Check later
  const firstDayOfSchedule = useMemo(() => {
    return scheduledStartDate
      ? startOfDay(fromUnixTime(scheduledStartDate))
      : startOfToday();
  }, [scheduledStartDate]);

  const isScheduleTimeshifted = !isToday(firstDayOfSchedule);

  const [filterRelatedEvents, setFilterRelatedEvents] = useState(false);

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
    () =>
      relatedVenueEvents.filter(isEventLiveOrFuture).map(
        prepareForSchedule({
          relatedVenues,
          usersEvents: userEventIds,
        })
      ),
    [relatedVenueEvents, relatedVenues, userEventIds]
  );
  const hasSavedEvents = !!liveAndFutureEvents.filter((event) => event.isSaved)
    .length;

  const isShowPersonalDownloadBtn = hasSavedEvents && showPersonalisedSchedule;
  const liveEventsMinimalStartValue = Math.min(
    ...liveAndFutureEvents.map((event) => event.start_utc_seconds)
  );

  const firstLiveEvent = liveAndFutureEvents.find(
    (event) => event.start_utc_seconds === liveEventsMinimalStartValue
  );

  const minDateUtcSeconds = useMemo(
    () =>
      firstLiveEvent ? getUnixTime(liveEventsMinimalStartValue) : minRangeValue,
    [firstLiveEvent, liveEventsMinimalStartValue]
  );

  const isMinDateWithinToday = isDateRangeStartWithinToday({
    dateValue: secondsToMilliseconds(minDateUtcSeconds),
    targetDateValue: millisecondsToSeconds(startOfToday().getTime()),
  });

  const firstRangeDateInSeconds = getUnixTime(
    max([new Date(secondsToMilliseconds(minDateUtcSeconds)), todaysDate])
  );

  const isOneEventAndLive =
    secondsToMilliseconds(firstRangeDateInSeconds) <= todaysDate.getTime() &&
    liveAndFutureEvents.length === 1;

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

  const dayDifference = getEventDayRange(daysInBetween, isOneEventAndLive);

  const firstScheduleDate = useMemo(
    () =>
      isMinDateWithinToday
        ? todaysDate
        : new Date(secondsToMilliseconds(minDateUtcSeconds)),
    [isMinDateWithinToday, minDateUtcSeconds]
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
    firstScheduleDate,
  ]);

  const scheduleNG: ScheduleNGDay = useMemo(() => {
    const day = addDays(firstScheduleDate, selectedDayIndex);

    const daysEvents = liveAndFutureEvents.filter(
      isEventWithinDateAndNotFinished(day)
    );

    const eventsFilledWithPriority = daysEvents
      .map((event) => ({ ...event, orderPriority: event.orderPriority ?? 0 }))
      .sort(eventTimeAndOrderComparator);

    return {
      scheduleDate: day,
      daysEvents: showPersonalisedSchedule
        ? eventsFilledWithPriority.filter((event) => event.isSaved)
        : filterRelatedEvents
        ? eventsFilledWithPriority.filter(
            (event) => event.room === venueRoomTitle
          )
        : eventsFilledWithPriority,
    };
  }, [
    liveAndFutureEvents,
    selectedDayIndex,
    showPersonalisedSchedule,
    firstScheduleDate,
    filterRelatedEvents,
    venueRoomTitle,
  ]);

  const downloadPersonalEventsCalendar = useCallback(() => {
    const allPersonalEvents: ScheduledVenueEvent[] = liveAndFutureEvents
      .map(
        prepareForSchedule({
          relatedVenues,
          usersEvents: userEventIds,
        })
      )
      .filter((event) => event.isSaved);

    downloadCalendar({
      calendar: createCalendar({ events: allPersonalEvents }),
      calendarName: `${PLATFORM_BRAND_NAME}_Personal`,
    });
  }, [liveAndFutureEvents, relatedVenues, userEventIds]);

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
    <div className="NavBarWrapper">
      <div className={containerClasses}>
        <div className="NavBarSchedule__breadcrumb">
          <button
            onClick={() => setFilterRelatedEvents(false)}
            className={filterRelatedEvents ? "button--a disabled" : "button--a"}
          >
            {sovereignVenue?.name}
          </button>

          {venueId !== sovereignVenue?.id && (
            <>
              {" "}
              /{" "}
              <button
                onClick={() => setFilterRelatedEvents(true)}
                className={
                  !filterRelatedEvents ? "button--a disabled" : "button--a"
                }
              >
                {currentVenue?.name}
              </button>
            </>
          )}
        </div>

        {/* Disabled as per designs. Up for deletion if confirmied not necessary */}
        {/* {venueId && <ScheduleVenueDescription venueId={venueId} />} */}

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
      {!isLoadingSchedule && (
        <div className="NavBarWrapper__download-buttons">
          {isShowPersonalDownloadBtn && (
            <Button
              onClick={downloadPersonalEventsCalendar}
              customClass="NavBarWrapper__download-schedule-btn"
            >
              Download your schedule
            </Button>
          )}
          <Button
            onClick={downloadAllEventsCalendar}
            customClass="NavBarWrapper__download-schedule-btn"
          >
            Download full schedule
          </Button>
        </div>
      )}
    </div>
  );
};
