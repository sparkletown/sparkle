import React, {
  useState,
  useMemo,
  FC,
  MouseEventHandler,
  useCallback,
} from "react";
import {
  addDays,
  startOfToday,
  format,
  getUnixTime,
  fromUnixTime,
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

  const { isLoading, relatedVenues, relatedVenueIds } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const {
    isEventsLoading,
    events: relatedVenueEvents = emptyRelatedEvents,
  } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const isLoadingSchedule = isLoading || isEventsLoading;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const weekdays = useMemo(() => {
    const today = startOfToday();

    return range(0, SCHEDULE_SHOW_DAYS_AHEAD).map((dayIndex) => {
      const day = addDays(today, dayIndex);
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
          {dayIndex === 0 ? "Today" : format(day, "E")}
        </li>
      );
    });
  }, [selectedDayIndex]);

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
    const dayStart = addDays(startOfToday(), selectedDayIndex);
    const daysEvents = relatedVenueEvents
      .filter(isEventWithinDate(selectedDayIndex === 0 ? Date.now() : dayStart))
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
  }, [relatedVenueEvents, userEventIds, selectedDayIndex, getEventLocation]);

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
