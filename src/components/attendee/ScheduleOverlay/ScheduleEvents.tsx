import React, { useCallback, useMemo } from "react";
import { addDays } from "date-fns";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import {
  addEventToPersonalizedSchedule,
  removeEventFromPersonalizedSchedule,
} from "api/profile";

import { ScheduledEvent } from "types/venues";

import {
  eventTimeAndOrderComparator,
  isEventWithinDateAndNotFinished,
} from "utils/event";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";
import useVenueScheduleEvents from "hooks/useVenueScheduleEvents";

import { ScheduleEvent } from "./ScheduleEvent";

import CN from "./ScheduleOverlay.module.scss";

interface ScheduleDay {
  daysEvents: ScheduledEvent[];
  scheduleDate: Date;
}

type ScheduleEventsProps = {
  showPersonalisedSchedule: boolean;
  selectedDayIndex: number;
};

export const ScheduleEvents: React.FC<ScheduleEventsProps> = ({
  showPersonalisedSchedule,
  selectedDayIndex,
}) => {
  const { world } = useWorldAndSpaceByParams();
  const { userWithId } = useUser();
  const userEventIds =
    userWithId?.myPersonalizedSchedule ?? ALWAYS_EMPTY_OBJECT;

  const { firstScheduleDate, liveAndFutureEvents } = useVenueScheduleEvents({
    userEventIds,
  });

  const bookmarkEvent = useCallback(
    (event: ScheduledEvent) => {
      if (!userWithId?.id || !event.id) return;

      event.isSaved
        ? removeEventFromPersonalizedSchedule({ event, userId: userWithId?.id })
        : addEventToPersonalizedSchedule({ event, userId: userWithId?.id });
    },
    [userWithId?.id]
  );

  const schedule: ScheduleDay = useMemo(() => {
    const day = addDays(firstScheduleDate, selectedDayIndex);
    console.log(liveAndFutureEvents);
    const daysEvents = liveAndFutureEvents.filter(
      isEventWithinDateAndNotFinished(day)
    );

    const eventsFilledWithPriority = daysEvents.sort(
      eventTimeAndOrderComparator
    );

    const currentVenueBookMarkEvents = eventsFilledWithPriority.filter(
      ({ isSaved, worldId }) =>
        isSaved && worldId?.toLowerCase() === world?.id.toLowerCase()
    );

    const currentVenueEvents = eventsFilledWithPriority.filter(
      ({ worldId }) => worldId?.toLowerCase() === world?.id.toLowerCase()
    );

    return {
      scheduleDate: day,
      daysEvents: showPersonalisedSchedule
        ? currentVenueBookMarkEvents
        : currentVenueEvents,
    };
  }, [
    firstScheduleDate,
    selectedDayIndex,
    liveAndFutureEvents,
    showPersonalisedSchedule,
    world,
  ]);

  const renderedEvents = useMemo(
    () =>
      schedule.daysEvents.map((event) => (
        <ScheduleEvent
          key={event.id}
          event={event}
          bookmarkEvent={bookmarkEvent}
        />
      )),
    [schedule.daysEvents, bookmarkEvent]
  );

  return (
    <div className={CN.scheduleOverlayContent}>
      <div className={CN.contentWrapper}>{renderedEvents}</div>
    </div>
  );
};
