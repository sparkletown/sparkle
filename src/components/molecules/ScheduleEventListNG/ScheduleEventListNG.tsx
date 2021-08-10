import React, { useCallback, useMemo, useState } from "react";
import isToday from "date-fns/isToday";

import { EVENTS_PREVIEW_LIST_LENGTH } from "settings";

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
  const [showMoreLiveEvents, setShowMoreLiveEvents] = useState(false);
  const toggleShowMoreLiveEvents = useCallback(() => {
    setShowMoreLiveEvents(!showMoreLiveEvents);
  }, [showMoreLiveEvents, setShowMoreLiveEvents]);
  const liveEvents = useMemo(() => daysEvents.filter(isEventLive), [
    daysEvents,
  ]);
  const renderLiveEvents = useMemo(() => {
    if (showMoreLiveEvents) {
      return liveEvents.map((event) => (
        <ScheduleItemNG key={event.id} event={event} />
      ));
    }

    return liveEvents
      .slice(0, EVENTS_PREVIEW_LIST_LENGTH)
      .map((event) => <ScheduleItemNG key={event.id} event={event} />);
  }, [liveEvents, showMoreLiveEvents]);
  const hasLiveEvents = liveEvents.length > 0;
  const shouldShowMoreLiveEvents =
    liveEvents.length > EVENTS_PREVIEW_LIST_LENGTH;

  // TODO: add show more/show less functionality
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

  // TODO: add show more/show less functionality
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
      {renderLiveEvents}
      {shouldShowMoreLiveEvents && (
        <div
          className="ScheduleEventListNG__button"
          onClick={toggleShowMoreLiveEvents}
        >
          {showMoreLiveEvents
            ? "Show less"
            : `Show more (${liveEvents.length - EVENTS_PREVIEW_LIST_LENGTH})`}
        </div>
      )}
      {hasComingSoonEvents && listTitle("Starting soon")}
      {comingSoonEvents}
      {hasLaterEvents && listTitle("More events today")}
      {laterEvents}
    </div>
  );
};
