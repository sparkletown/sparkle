import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import {
  addDays,
  format,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
} from "date-fns";

import { PLATFORM_BRAND_NAME } from "settings";

import { ScheduledVenueEvent } from "types/venues";

import { createCalendar, downloadCalendar } from "utils/calendar";
import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoomRecentUsersList } from "hooks/useRoomRecentUsersList";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { ScheduleNG } from "components/molecules/ScheduleNG";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import { Button } from "components/atoms/Button";
import { Toggler } from "components/atoms/Toggler";

import { prepareForSchedule } from "./utils";

import "./NavBarSchedule.scss";

export interface ScheduleNGDay {
  daysEvents: ScheduledVenueEvent[];
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

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const {
    isShown: showPersonalisedSchedule,
    toggle: togglePersonalisedSchedule,
  } = useShowHide(false);

  const {
    dayDifference,
    firstScheduleDate,
    liveAndFutureEvents,
    isEventsLoading,
    sovereignVenue,
    relatedVenues,
  } = useVenueScheduleEvents({ venueId, userEventIds });

  const scheduledStartDate = sovereignVenue?.start_utc_seconds;

  // @debt: probably will need to be re-calculated based on minDateUtcSeconds instead of startOfDay.Check later
  const firstDayOfSchedule = useMemo(() => {
    return scheduledStartDate
      ? startOfDay(fromUnixTime(scheduledStartDate))
      : startOfToday();
  }, [scheduledStartDate]);

  const isScheduleTimeshifted = !isToday(firstDayOfSchedule);
  const { currentVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const [filterRelatedEvents, setFilterRelatedEvents] = useState(false);

  const hasSavedEvents = !!liveAndFutureEvents.filter((event) => event.isSaved)
    .length;

  const isShowPersonalDownloadBtn = hasSavedEvents && showPersonalisedSchedule;

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

    const eventsFilledWithPriority = daysEvents.sort(
      eventTimeAndOrderComparator
    );

    const currentVenueBookMarkEvents = eventsFilledWithPriority.filter(
      ({ isSaved, venueId: eventVenueId }) =>
        isSaved && eventVenueId?.toLowerCase() === venueId
    );

    const currentVenueEvents = eventsFilledWithPriority.filter(
      (event) => event.venueId === venueId?.toLowerCase()
    );

    const personalisedSchedule = filterRelatedEvents
      ? currentVenueBookMarkEvents
      : eventsFilledWithPriority.filter((event) => event.isSaved);

    return {
      scheduleDate: day,
      daysEvents: showPersonalisedSchedule
        ? personalisedSchedule
        : filterRelatedEvents
        ? currentVenueEvents
        : eventsFilledWithPriority,
    };
  }, [
    liveAndFutureEvents,
    selectedDayIndex,
    showPersonalisedSchedule,
    firstScheduleDate,
    filterRelatedEvents,
    venueId,
  ]);

  const roomList = scheduleNG.daysEvents.map((el) => {
    const [roomData] =
      currentVenue?.rooms?.filter((room) => room.title === el?.room) || [];
    return roomData;
  });
  const recentRoomUsers = useRoomRecentUsersList({ roomList });

  const scheduleNGWithAttendees = {
    ...scheduleNG,
    daysEvents: scheduleNG.daysEvents.map((event, index) =>
      prepareForSchedule({
        relatedVenues,
        usersEvents: userEventIds,
        recentRoomUsers,
        index,
      })(event)
    ),
  };

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

  const isNotSovereignVenue = venueId !== sovereignVenue?.id;
  const breadcrumbSovereignVenueClasses = classNames(
    "NavBarScheduleBreadcrumb__btn",
    {
      "NavBarScheduleBreadcrumb__btn--disabled": filterRelatedEvents,
    }
  );

  const breadcrumbVenueClasses = classNames("NavBarScheduleBreadcrumb__btn", {
    "NavBarScheduleBreadcrumb__btn--disabled": !filterRelatedEvents,
  });

  return (
    <div className="NavBarWrapper">
      <div className={containerClasses}>
        <ul className="NavBarSchedule__weekdays">{weekdays}</ul>
        <div className="NavBarSchedule__breadcrumb">
          <label>Events on: </label>
          <button
            onClick={() => setFilterRelatedEvents(false)}
            className={breadcrumbSovereignVenueClasses}
          >
            {sovereignVenue?.name}
          </button>
          /
          {isNotSovereignVenue && (
            <button
              onClick={() => setFilterRelatedEvents(true)}
              className={breadcrumbVenueClasses}
            >
              {currentVenue?.name}
            </button>
          )}
        </div>
        {venueId && <ScheduleVenueDescription venueId={venueId} />}

        <Toggler
          containerClassName="NavBarSchedule__bookmarked-toggle"
          name="bookmarked-toggle"
          toggled={showPersonalisedSchedule}
          onChange={togglePersonalisedSchedule}
          label="Bookmarked events"
        />
        <ScheduleNG
          showPersonalisedSchedule={showPersonalisedSchedule}
          isLoading={isEventsLoading}
          {...scheduleNGWithAttendees}
        />
      </div>
      {!isEventsLoading && (
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
