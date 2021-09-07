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

import { User } from "types/User";
import { ScheduledVenueEvent } from "types/venues";

import { createCalendar, downloadCalendar } from "utils/calendar";
import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithId } from "utils/id";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoomRecentUsersList } from "hooks/useRoomRecentUsersList";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { NavBarBanner } from "components/molecules/NavBarScheduleWeather";
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

interface UserWithVenueIdProps extends WithId<User> {
  venueId?: string;
  portalId?: string;
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

  const [filterRelatedEvents, setFilterRelatedEvents] = useState(
    currentVenue?.id !== sovereignVenue?.id
  );

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
            className="NavBarSchedule__weekdayButton"
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

    const currentVenueId = currentVenue?.id?.toLowerCase();

    const currentVenueBookMarkEvents = eventsFilledWithPriority.filter(
      ({ isSaved, venueId }) =>
        isSaved && venueId?.toLowerCase() === currentVenueId
    );

    const currentVenueEvents = eventsFilledWithPriority.filter(
      ({ venueId }) => venueId?.toLowerCase() === currentVenueId
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
    currentVenue,
  ]);

  const day = addDays(firstScheduleDate, 0);

  const daysEvents = liveAndFutureEvents.filter(
    isEventWithinDateAndNotFinished(day)
  );

  const recentRoomUsers = useRoomRecentUsersList({
    eventList: daysEvents,
    venueId,
  });

  const flatRoomUsers: UserWithVenueIdProps[] = recentRoomUsers.flatMap(
    (user) => user
  );

  const scheduleNGWithAttendees = {
    ...scheduleNG,
    daysEvents: scheduleNG.daysEvents.map((event, index) =>
      prepareForSchedule({
        relatedVenues,
        usersEvents: userEventIds,
        recentRoomUsers: flatRoomUsers.filter((user) => {
          return user.portalId === event?.room?.trim();
        }),
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
    "NavBarSchedule__breadcrumbBtn",
    {
      "NavBarSchedule__breadcrumbBtn--disabled": filterRelatedEvents,
    }
  );

  const breadcrumbVenueClasses = classNames("NavBarSchedule__breadcrumbBtn", {
    "NavBarSchedule__breadcrumbBtn--disabled": !filterRelatedEvents,
  });

  const selectedVenue =
    (filterRelatedEvents ? venueId : sovereignVenue?.id) ?? "";

  return (
    <div className="NavBarSchedule__wrapper">
      <div className={containerClasses}>
        <NavBarBanner containerClassName="NavBarSchedule__endToEnd" />
        <ul className="NavBarSchedule__weekdays NavBarSchedule__endToEnd">
          {weekdays}
        </ul>
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
        {venueId && <ScheduleVenueDescription venueId={selectedVenue} />}
        <Toggler
          containerClassName="NavBarSchedule__bookmarkedToggle"
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
        {!isEventsLoading && (
          <div className="NavBarSchedule__downloadButtons">
            {isShowPersonalDownloadBtn && (
              <Button
                onClick={downloadPersonalEventsCalendar}
                customClass="NavBarSchedule__downloadScheduleBtn"
              >
                Download your schedule
              </Button>
            )}
            <Button
              onClick={downloadAllEventsCalendar}
              customClass="NavBarSchedule__downloadScheduleBtn"
            >
              Download full schedule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
