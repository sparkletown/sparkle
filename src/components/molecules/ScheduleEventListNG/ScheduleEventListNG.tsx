import React, { useMemo } from "react";
import isToday from "date-fns/isToday";

import { PersonalizedVenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { formatDateRelativeToNow } from "utils/time";

import { ScheduleEventSubListNG } from "./ScheduleEventSubListNG";
import { isEventLater, isEventSoon } from "./utils";

import "./ScheduleEventListNG.scss";

export interface ScheduleEventListNGProps {
  daysEvents: PersonalizedVenueEvent[];
  scheduleDate: Date;
}

export const ScheduleEventListNG: React.FC<ScheduleEventListNGProps> = ({
  daysEvents,
  scheduleDate,
}) => {
  const isTodayDate = isToday(scheduleDate);

  const liveEvents = useMemo(() => daysEvents.filter(isEventLive), [
    daysEvents,
  ]);
  const comingSoonEvents = useMemo(() => daysEvents.filter(isEventSoon), [
    daysEvents,
  ]);
  const laterEvents = useMemo(() => daysEvents.filter(isEventLater), [
    daysEvents,
  ]);

  if (!isTodayDate) {
    return (
      <div className="ScheduleEventListNG">
        <ScheduleEventSubListNG
          events={daysEvents}
          title={`Events on ${formatDateRelativeToNow(scheduleDate)}`}
        />
      </div>
    );
  }

  return (
    <div className="ScheduleEventListNG">
      <ScheduleEventSubListNG events={liveEvents} title="What’s on now" />
      <ScheduleEventSubListNG events={comingSoonEvents} title="Starting soon" />
      <ScheduleEventSubListNG events={laterEvents} title="More events today" />
    </div>
  );
};
