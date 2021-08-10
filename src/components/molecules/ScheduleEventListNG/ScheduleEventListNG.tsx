import React, { useMemo } from "react";
import isToday from "date-fns/isToday";

import { PersonalizedVenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { formatDateRelativeToNow } from "utils/time";

import { ScheduleItemNG } from "components/molecules/ScheduleItemNG";

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
  // TODO: add show more/show less functionality
  const liveEvents = useMemo(
    () =>
      daysEvents
        .filter(isEventLive)
        .map((event) => <ScheduleItemNG key={event.id} event={event} />),
    [daysEvents]
  );
  const hasLiveEvents = liveEvents.length > 0;

  const comingSoonEvents = useMemo(
    () =>
      daysEvents
        .filter(isEventSoon)
        .map((event) => <ScheduleItemNG key={event.id} event={event} />),
    [daysEvents]
  );
  const hasComingSoonEvents = comingSoonEvents.length > 0;

  const laterEvents = useMemo(
    () =>
      daysEvents
        .filter(isEventLater)
        .map((event) => <ScheduleItemNG key={event.id} event={event} />),
    [daysEvents]
  );
  const hasLaterEvents = laterEvents.length > 0;

  const eventsRows = useMemo(
    () =>
      daysEvents.map((event) => (
        <ScheduleItemNG key={event.id} event={event} />
      )),
    [daysEvents]
  );

  const listTitle = (title: string) => (
    <div className="ScheduleEventListNG__title">{title}</div>
  );

  const isTodayDate = isToday(scheduleDate);

  if (!isTodayDate) {
    return (
      <div className="ScheduleEventListNG">
        {listTitle(`Events on ${formatDateRelativeToNow(scheduleDate)}`)}
        {eventsRows}
      </div>
    );
  }

  return (
    <div className="ScheduleEventListNG">
      {hasLiveEvents && listTitle("What’s on now")}
      {liveEvents}
      {hasComingSoonEvents && listTitle("Starting soon")}
      {comingSoonEvents}
      {hasLaterEvents && listTitle("More events today")}
      {laterEvents}
    </div>
  );
};
