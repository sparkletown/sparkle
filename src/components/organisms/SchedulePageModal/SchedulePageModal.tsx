import React, {
  useState,
  useMemo,
  FC,
  MouseEventHandler,
  useCallback,
} from "react";
import { addDays, startOfToday, format, getUnixTime } from "date-fns";
import { chain, range } from "lodash";
import classNames from "classnames";

import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
import { useVenueId } from "hooks/useVenueId";
import { useUser } from "hooks/useUser";

import {
  PersonalizedVenueEvent,
  VenueLocation,
  LocatedEvents,
} from "types/venues";

import { WithVenueId } from "utils/id";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

import {
  buildLocationString,
  extractLocation,
  isEventLaterThisDay,
  prepareForSchedule,
} from "./utils";

import "./SchedulePageModal.scss";

const SCHEDULE_SHOW_DAYS_AHEAD = 7;

interface SchedulePageModalProps {
  isVisible?: boolean;
}

export interface ScheduleDay {
  isToday: boolean;
  weekday: string;
  dayStartUtcSeconds: number;
  locatedEvents: LocatedEvents[];
  personalEvents: WithVenueId<PersonalizedVenueEvent>[];
}

export const emptyPersonalizedSchedule = {};

export const SchedulePageModal: FC<SchedulePageModalProps> = ({
  isVisible,
}) => {
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
      const classes = classNames("SchedulePageModal__weekday", {
        "SchedulePageModal__weekday--active": dayIndex === selectedDayIndex,
      });

      const onWeekdayClick: MouseEventHandler<HTMLLIElement> = (e) => {
        e.stopPropagation();
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
      .filter(
        isEventLaterThisDay(selectedDayIndex === 0 ? Date.now() : dayStart)
      )
      .map(prepareForSchedule(dayStart, userEventIds));

    const locatedEvents: LocatedEvents[] = chain(daysEvents)
      .groupBy(buildLocationString)
      .map((value, key) => ({ location: getLocaion(key), events: value }))
      .value();

    return {
      locatedEvents,
      isToday: selectedDayIndex === 0,
      weekday: format(dayStart, "E"),
      dayStartUtcSeconds: getUnixTime(dayStart),
      personalEvents: daysEvents.filter((event) => event.isSaved),
    };
  }, [relatedVenueEvents, userEventIds, selectedDayIndex, getLocaion]);

  const containerClasses = classNames("SchedulePageModal", {
    "SchedulePageModal--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      <ScheduleVenueDescription />

      <ul className="SchedulePageModal__weekdays">{weekdays}</ul>

      {schedule.locatedEvents.length > 0 ? (
        <Schedule
          locatedEvents={schedule.locatedEvents}
          personalEvents={schedule.personalEvents}
          isToday={schedule.isToday}
        />
      ) : (
        <div className="SchedulePageModal__no-events">No events scheduled</div>
      )}
    </div>
  );
};
