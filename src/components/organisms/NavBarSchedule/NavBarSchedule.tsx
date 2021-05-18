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
import { chain, range } from "lodash";
import classNames from "classnames";

import { SCHEDULE_SHOW_DAYS_AHEAD } from "settings";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import {
  PersonalizedVenueEvent,
  VenueLocation,
  LocatedEvents,
} from "types/venues";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import {
  buildLocationString,
  extractLocation,
  prepareForSchedule,
} from "./utils";
import { isEventWithinDate } from "utils/event";

import "./NavBarSchedule.scss";

interface NavBarScheduleProps {
  isVisible?: boolean;
}

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

  const { relatedVenueEvents, relatedVenues } = useConnectRelatedVenues({
    venueId,
    withEvents: true,
  });

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

  const getLocaion = useCallback(
    (locString: string): VenueLocation => {
      const [venueId, roomTitle = ""] = extractLocation(locString);
      const venueTitle =
        relatedVenues.find((venue) => venue.id === venueId)?.name || "";
      return { venueId, roomTitle, venueTitle };
    },
    [relatedVenues]
  );

  const schedule: ScheduleDay = useMemo(() => {
    const dayStart = addDays(startOfToday(), selectedDayIndex);
    const daysEvents = relatedVenueEvents
      .filter(isEventWithinDate(selectedDayIndex === 0 ? Date.now() : dayStart))
      .map(prepareForSchedule(dayStart, userEventIds));

    const locatedEvents: LocatedEvents[] = chain(daysEvents)
      .groupBy(buildLocationString)
      .map((value, key) => ({ location: getLocaion(key), events: value }))
      .value();

    return {
      locatedEvents,
      isToday: selectedDayIndex === 0,
      dayStartUtcSeconds: getUnixTime(dayStart),
      personalEvents: daysEvents.filter((event) => event.isSaved),
    };
  }, [relatedVenueEvents, userEventIds, selectedDayIndex, getLocaion]);

  // if .NavBarSchedule is changed, we need to update the class name in NavBar#hideEventSchedule event handler as well
  const containerClasses = classNames("NavBarSchedule", {
    "NavBarSchedule--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      {venueId && <ScheduleVenueDescription venueId={venueId} />}
      <ul className="NavBarSchedule__weekdays">{weekdays}</ul>
      <Schedule
        locatedEvents={schedule.locatedEvents}
        personalEvents={schedule.personalEvents}
        isToday={schedule.isToday}
        scheduleDate={fromUnixTime(schedule.dayStartUtcSeconds)}
      />
    </div>
  );
};
