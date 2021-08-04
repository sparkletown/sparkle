import React, { useCallback, useMemo, useState } from "react";
import {
  addDays,
  format,
  fromUnixTime,
  isToday,
  startOfDay,
  startOfToday,
  minutesToSeconds,
  secondsToMilliseconds,
  millisecondsToHours,
} from "date-fns";
import classNames from "classnames";
import { groupBy } from "lodash";

import {
  LocationEvents,
  PersonalizedVenueEvent,
  VenueEvent,
  VenueLocation,
} from "types/venues";

import {
  isEventWithinDate,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithVenueId } from "utils/id";
import { range } from "utils/range";
import { formatDateRelativeToNow } from "utils/time";
import { getScheduleTimelineNames } from "utils/schedule";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";
import { useVenueEvents } from "hooks/events";

import { Schedule } from "components/molecules/Schedule";

// Enable when Schedule V3 bookmarked events are ready
// import { createCalendar, downloadCalendar } from "utils/calendar";
// import { PLATFORM_BRAND_NAME } from "settings";
// import { Button } from "components/atoms/Button";

import {
  buildLocationString,
  extractLocation,
  prepareForSchedule,
} from "./utils";

import "./NavBarSchedule.scss";

const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];

export interface ScheduleDay {
  isToday: boolean;
  scheduleDate: Date;
  locatedEvents: LocationEvents[];
  personalEvents: PersonalizedVenueEvent[];
}

export const emptyPersonalizedSchedule = {};
export interface NavBarScheduleV2Props {
  isVisible?: boolean;
  venueId: string;
}

export const NavBarScheduleV2: React.FC<NavBarScheduleV2Props> = ({
  isVisible,
  venueId,
}) => {
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? emptyPersonalizedSchedule;

  const {
    isLoading,
    relatedVenues,
    relatedVenueIds,
    sovereignVenue,
  } = useRelatedVenues({
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
        return getScheduleTimelineNames(format(day, "d"));
      } else {
        return formatDateRelativeToNow(day, {
          formatOtherDate: (dateOrTimestamp) =>
            getScheduleTimelineNames(format(dateOrTimestamp, "d")),
          formatTomorrow: (dateOrTimestamp) =>
            getScheduleTimelineNames(format(dateOrTimestamp, "d")),
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

      const classes = classNames("NavBarScheduleV2__weekday", {
        "NavBarScheduleV2__weekday--active": dayIndex === selectedDayIndex,
        "NavBarScheduleV2__weekday--disabled": !daysWithEvents.length,
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
            className="NavBarScheduleV2__weekday-button"
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

  const getEventLocation = useCallback(
    (locString: string): VenueLocation => {
      const [venueId, roomTitle] = extractLocation(locString);
      const venueName = relatedVenues.find((venue) => venue.id === venueId)
        ?.name;
      return { venueId, venueName, roomTitle: roomTitle || undefined };
    },
    [relatedVenues]
  );

  const schedule: ScheduleDay = useMemo(() => {
    const startOfSelectedDay = addDays(firstDayOfSchedule, selectedDayIndex);
    const daysEvents = relatedVenueEvents
      .filter(
        isScheduleTimeshifted
          ? isEventWithinDate(startOfSelectedDay)
          : isEventWithinDateAndNotFinished(startOfSelectedDay)
      )
      .map(
        prepareForSchedule({
          day: startOfSelectedDay,
          usersEvents: userEventIds,
        })
      );
    console.log(daysEvents);
    const locatedEvents: LocationEvents[] = Object.entries(
      groupBy(daysEvents, buildLocationString)
    ).map(([group, events]) => ({
      events,
      location: getEventLocation(group),
    }));

    return {
      locatedEvents,
      isToday: selectedDayIndex === 0,
      scheduleDate: startOfSelectedDay,
      personalEvents: daysEvents.filter((event) => event.isSaved),
    };
  }, [
    relatedVenueEvents,
    userEventIds,
    selectedDayIndex,
    getEventLocation,
    firstDayOfSchedule,
    isScheduleTimeshifted,
  ]);

  // Enable when Schedule V3 bookmarked events are ready

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

  // const downloadAllEventsCalendar = useCallback(() => {
  //   downloadCalendar({
  //     calendar: createCalendar({ events: relatedVenueEvents }),
  //     calendarName: `${PLATFORM_BRAND_NAME}_Full`,
  //   });
  // }, [relatedVenueEvents]);

  const containerClasses = classNames("NavBarScheduleV2", {
    "NavBarScheduleV2--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      {/* Enable when Schedule V3 bookmarked events are ready */}

      {/* {!isLoadingSchedule && (
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
      )} */}
      <ul className="NavBarScheduleV2__weekdays">{weekdays}</ul>

      <Schedule isLoading={isLoadingSchedule} {...schedule} />
    </div>
  );
};
