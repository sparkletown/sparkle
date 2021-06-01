import React, { useState, useMemo, useCallback } from "react";
import {
  addDays,
  format,
  fromUnixTime,
  startOfToday,
  startOfDay,
  isToday,
} from "date-fns";
import { groupBy } from "lodash";
import classNames from "classnames";

import { SCHEDULE_SHOW_DAYS_AHEAD } from "settings";

import {
  PersonalizedVenueEvent,
  VenueLocation,
  LocationEvents,
  VenueEvent,
} from "types/venues";

import {
  isEventWithinDate,
  isEventWithinDateAndNotFinished,
} from "utils/event";
import { WithVenueId } from "utils/id";
import { range } from "utils/range";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";
import { useVenueEvents } from "hooks/events";

import { Schedule } from "components/molecules/Schedule";
import { ScheduleVenueDescription } from "components/molecules/ScheduleVenueDescription";

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

  const weekdays = useMemo(() => {
    const formatDayLabel = (day: Date | number) => {
      if (isScheduleTimeshifted) {
        return format(day, "E, LLL d");
      } else {
        return isToday(day) ? "Today" : format(day, "E");
      }
    };

    return range(SCHEDULE_SHOW_DAYS_AHEAD).map((dayIndex) => {
      const day = addDays(firstDayOfSchedule, dayIndex);
      const classes = classNames("NavBarSchedule__weekday", {
        "NavBarSchedule__weekday--active": dayIndex === selectedDayIndex,
      });

      return (
        <li
          key={day.toISOString()}
          className={classes}
          onClick={() => {
            setSelectedDayIndex(dayIndex);
          }}
        >
          {formatDayLabel(day)}
        </li>
      );
    });
  }, [selectedDayIndex, firstDayOfSchedule, isScheduleTimeshifted]);

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
      .map(prepareForSchedule(startOfSelectedDay, userEventIds));

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

  const containerClasses = classNames("NavBarSchedule", {
    "NavBarSchedule--show": isVisible,
  });

  return (
    <div className={containerClasses}>
      {venueId && <ScheduleVenueDescription venueId={venueId} />}
      <ul className="NavBarSchedule__weekdays">{weekdays}</ul>

      <Schedule isLoading={isLoadingSchedule} {...schedule} />
    </div>
  );
};
