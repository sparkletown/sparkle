import React, {
  useState,
  useMemo,
  FC,
  MouseEventHandler,
  useCallback,
} from "react";
import {
  addDays,
  format,
  getUnixTime,
  fromUnixTime,
  startOfToday,
  startOfDay,
} from "date-fns";
import { groupBy, range } from "lodash";
import classNames from "classnames";

import { SCHEDULE_SHOW_DAYS_AHEAD } from "settings";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";
import { useVenueEvents } from "hooks/events";

import {
  PersonalizedVenueEvent,
  VenueLocation,
  LocatedEvents,
  VenueEvent,
} from "types/venues";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import {
  buildLocationString,
  extractLocation,
  prepareForSchedule,
} from "./utils";
import { isEventWithinDate } from "utils/event";
import { WithVenueId } from "utils/id";
import { isTruthy } from "utils/types";

import "./NavBarSchedule.scss";

interface NavBarScheduleProps {
  isVisible?: boolean;
}

const emptyRelatedEvents: WithVenueId<VenueEvent>[] = [];

export interface ScheduleDay {
  isToday: boolean;
  dayStartUtcSeconds: number;
  locatedEvents: LocatedEvents[];
  personalEvents: PersonalizedVenueEvent[];
}

export const emptyPersonalizedSchedule = {};

export const NavBarSchedule: FC<NavBarScheduleProps> = ({ isVisible }) => {
  const venueId = useVenueId();
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

  const hasScheduleStartDate: boolean = isTruthy(
    sovereignVenue?.scheduleStartDate
  );
  const scheduleStartDate: Date = sovereignVenue?.scheduleStartDate?.toDate()!;
  const firstDay = useMemo(() => {
    return hasScheduleStartDate
      ? startOfDay(scheduleStartDate)
      : startOfToday();
  }, [hasScheduleStartDate, scheduleStartDate]);

  const {
    isEventsLoading,
    events: relatedVenueEvents = emptyRelatedEvents,
  } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const isLoadingSchedule = isLoading || isEventsLoading;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const weekdays = useMemo(() => {
    return range(0, SCHEDULE_SHOW_DAYS_AHEAD).map((dayIndex) => {
      const day = addDays(firstDay, dayIndex);
      const classes = classNames("NavBarSchedule__weekday", {
        "NavBarSchedule__weekday--active": dayIndex === selectedDayIndex,
      });

      const onWeekdayClick: MouseEventHandler<HTMLLIElement> = () => {
        setSelectedDayIndex(dayIndex);
      };

      return (
        <li
          key={day.toISOString()}
          className={classes}
          onClick={onWeekdayClick}
        >
          {hasScheduleStartDate
            ? format(day, "E, LLL d")
            : dayIndex === 0
            ? "Today"
            : format(day, "E")}
        </li>
      );
    });
  }, [selectedDayIndex, firstDay, hasScheduleStartDate]);

  const getEventLocation = useCallback(
    (locString: string): VenueLocation => {
      const [venueId, roomTitle = ""] = extractLocation(locString);
      const venueTitle = relatedVenues.find((venue) => venue.id === venueId)
        ?.name;
      return { venueId, roomTitle, venueTitle };
    },
    [relatedVenues]
  );

  const schedule: ScheduleDay = useMemo(() => {
    const dayStart = addDays(firstDay, selectedDayIndex);
    const daysEvents = relatedVenueEvents
      .filter(
        isEventWithinDate(
          selectedDayIndex === 0 && !hasScheduleStartDate
            ? Date.now()
            : dayStart
        )
      )
      .map(prepareForSchedule(dayStart, userEventIds));

    const locatedEvents: LocatedEvents[] = Object.entries(
      groupBy(daysEvents, buildLocationString)
    ).map(([group, events]) => ({
      events,
      location: getEventLocation(group),
    }));

    return {
      locatedEvents,
      isToday: selectedDayIndex === 0,
      dayStartUtcSeconds: getUnixTime(dayStart),
      personalEvents: daysEvents.filter((event) => event.isSaved),
    };
  }, [
    relatedVenueEvents,
    userEventIds,
    selectedDayIndex,
    getEventLocation,
    firstDay,
    hasScheduleStartDate,
  ]);

  const containerClasses = classNames("NavBarSchedule", {
    "NavBarSchedule--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      {venueId && <ScheduleVenueDescription venueId={venueId} />}
      <ul className="NavBarSchedule__weekdays">{weekdays}</ul>

      <Schedule
        isLoading={isLoadingSchedule}
        locatedEvents={schedule.locatedEvents}
        personalEvents={schedule.personalEvents}
        isToday={schedule.isToday}
        scheduleDate={fromUnixTime(schedule.dayStartUtcSeconds)}
      />
    </div>
  );
};
