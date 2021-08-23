import React, { useEffect, useMemo, useState } from "react";
import isToday from "date-fns/isToday";

import { EVENT_STATUS_REFRESH_MS } from "settings";

import { ScheduledVenueEvent } from "types/venues";

import { isEventLater, isEventLive, isEventSoon } from "utils/event";
import { formatDateRelativeToNow } from "utils/time";

import { useInterval } from "hooks/useInterval";

import { ScheduleEventSubListNG } from "./ScheduleEventSubListNG";

import "./ScheduleEventListNG.scss";

export interface ScheduleEventListNGProps {
  daysEvents: ScheduledVenueEvent[];
  scheduleDate: Date;
}

export const ScheduleEventListNG: React.FC<ScheduleEventListNGProps> = ({
  daysEvents,
  scheduleDate,
}) => {
  const isTodayDate = isToday(scheduleDate);
  const [allEvents, setAllEvents] = useState(daysEvents);

  useInterval(() => setAllEvents([...allEvents]), EVENT_STATUS_REFRESH_MS);

  useEffect(() => {
    setAllEvents([...daysEvents]);
  }, [daysEvents, setAllEvents]);

  const liveEvents = useMemo(
    () =>
      allEvents
        .filter(isEventLive)
        .sort((a, b) => b.liveAudience - a.liveAudience),
    [allEvents]
  );
  const comingSoonEvents = useMemo(() => allEvents.filter(isEventSoon), [
    allEvents,
  ]);
  const laterEvents = useMemo(() => allEvents.filter(isEventLater), [
    allEvents,
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
