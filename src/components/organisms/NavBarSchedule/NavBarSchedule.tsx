import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { Toggler } from "components/attendee/Toggler";
import {
  addDays,
  format,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
} from "date-fns";

import { ALWAYS_EMPTY_ARRAY, PLATFORM_BRAND_NAME } from "settings";

import { SpaceId } from "types/id";
import { ScheduledEvent } from "types/venues";

import { createCalendar, downloadCalendar } from "utils/calendar";
import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { Breadcrumbs } from "components/molecules/Breadcrumbs";
import { Schedule } from "components/molecules/Schedule";

import { ButtonNG } from "components/atoms/ButtonNG";

import { prepareForSchedule } from "./utils";

import "./NavBarSchedule.scss";

interface ScheduleDay {
  daysEvents: ScheduledEvent[];
  scheduleDate: Date;
}

const emptyPersonalizedSchedule = {};
interface NavBarScheduleProps {
  isVisible?: boolean;
  venueId: SpaceId;
}

export const NavBarSchedule: React.FC<NavBarScheduleProps> = ({
  isVisible,
  venueId,
}) => {
  const { currentVenue: venue, findVenueInRelatedVenues } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const { worldSlug } = useWorldParams();

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
  } = useVenueScheduleEvents({ userEventIds });

  const scheduledStartDate = sovereignVenue?.start_utc_seconds;

  const isNotSovereignVenue = venue?.id !== sovereignVenue?.id;

  const [filterRelatedEvents, setFilterRelatedEvents] = useState(false);

  // @debt: probably will need to be re-calculated based on minDateUtcSeconds instead of startOfDay.Check later
  const firstDayOfSchedule = useMemo(() => {
    return scheduledStartDate
      ? startOfDay(fromUnixTime(scheduledStartDate))
      : startOfToday();
  }, [scheduledStartDate]);

  const isScheduleTimeshifted = !isToday(firstDayOfSchedule);
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

    if (dayDifference <= 0) return ALWAYS_EMPTY_ARRAY;

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

  const schedule: ScheduleDay = useMemo(() => {
    const day = addDays(firstScheduleDate, selectedDayIndex);

    const daysEvents = liveAndFutureEvents.filter(
      isEventWithinDateAndNotFinished(day)
    );

    const eventsFilledWithPriority = daysEvents.sort(
      eventTimeAndOrderComparator
    );

    const currentVenueBookMarkEvents = eventsFilledWithPriority.filter(
      ({ isSaved, spaceId: eventSpaceId }) =>
        isSaved && eventSpaceId?.toLowerCase() === venueId
    );

    const currentVenueEvents = eventsFilledWithPriority.filter(
      ({ spaceId: eventSpaceId }) => eventSpaceId?.toLowerCase() === venueId
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
    firstScheduleDate,
    selectedDayIndex,
    liveAndFutureEvents,
    filterRelatedEvents,
    showPersonalisedSchedule,
    venueId,
  ]);

  const scheduleWithAttendees = {
    ...schedule,
    daysEvents: schedule.daysEvents.map((event) => {
      const portalVenue = findVenueInRelatedVenues({ spaceId: event.spaceId });

      return prepareForSchedule({
        worldSlug,
        relatedVenues,
        usersEvents: userEventIds,
        recentRoomUsersCount: portalVenue?.recentUserCount,
      })(event);
    }),
  };
  const downloadPersonalEventsCalendar = useCallback(() => {
    const allPersonalEvents: ScheduledEvent[] = liveAndFutureEvents
      .map(
        prepareForSchedule({
          worldSlug,
          relatedVenues,
          usersEvents: userEventIds,
        })
      )
      .filter((event) => event.isSaved);

    downloadCalendar({
      calendar: createCalendar({
        worldSlug,
        relatedVenues,
        events: allPersonalEvents,
      }),
      calendarName: `${PLATFORM_BRAND_NAME}_Personal`,
    });
  }, [liveAndFutureEvents, relatedVenues, userEventIds, worldSlug]);

  const downloadAllEventsCalendar = useCallback(() => {
    downloadCalendar({
      calendar: createCalendar({
        worldSlug,
        relatedVenues,
        events: liveAndFutureEvents,
      }),
      calendarName: `${PLATFORM_BRAND_NAME}_Full`,
    });
  }, [worldSlug, relatedVenues, liveAndFutureEvents]);

  const containerClasses = classNames("NavBarSchedule", {
    "NavBarSchedule--show": isVisible,
  });

  const breadcrumbedLocations = useMemo(() => {
    if (!sovereignVenue) return [];

    const locations = [{ key: sovereignVenue.id, name: sovereignVenue.name }];

    if (venue && isNotSovereignVenue)
      locations.push({ key: venue.id, name: venue.name });

    return locations;
  }, [isNotSovereignVenue, sovereignVenue, venue]);

  const onBreacrumbsSelect = useCallback(
    (key: string) => {
      setFilterRelatedEvents(key === venue?.id && isNotSovereignVenue);
    },
    [venue, isNotSovereignVenue]
  );

  return (
    <div className={containerClasses}>
      <div className="NavBarSchedule__wrapper">
        <ul className="NavBarSchedule__weekdays">{weekdays}</ul>
        {venue && sovereignVenue && (
          <Breadcrumbs
            containerClassName="NavBarSchedule__breadcrumbs"
            label="Schedule for"
            onSelect={onBreacrumbsSelect}
            locations={breadcrumbedLocations}
          />
        )}
        <Toggler
          containerClassName="NavBarSchedule__bookmarked-toggle"
          name="bookmarked-toggle"
          toggled={showPersonalisedSchedule}
          onChange={togglePersonalisedSchedule}
          title="Bookmarked events"
        />
        <Schedule
          showPersonalisedSchedule={showPersonalisedSchedule}
          isLoading={isEventsLoading}
          {...scheduleWithAttendees}
        />
        {!isEventsLoading && (
          <div className="NavBarSchedule__download-buttons">
            {isShowPersonalDownloadBtn && (
              <ButtonNG
                onClick={downloadPersonalEventsCalendar}
                className="NavBarSchedule__download-schedule-button"
                variant="primary"
              >
                Download your schedule
              </ButtonNG>
            )}
            <ButtonNG
              onClick={downloadAllEventsCalendar}
              className="NavBarSchedule__download-schedule-button"
              variant="primary"
            >
              Download full schedule
            </ButtonNG>
          </div>
        )}
      </div>
    </div>
  );
};
