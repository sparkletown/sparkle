import React, { useMemo } from "react";

import { EVENTS_PREVIEW_LIST_LENGTH } from "settings";

import { ScheduledVenueEvent } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { ScheduleItemNG } from "components/molecules/ScheduleItemNG";

import "./ScheduleEventListNG.scss";

export interface ScheduleEventSubListNGProps {
  events: ScheduledVenueEvent[];
  title: string;
  isLive?: boolean;
}

export const ScheduleEventSubListNG: React.FC<ScheduleEventSubListNGProps> = ({
  events,
  title,
  isLive = false,
}) => {
  const {
    isShown: showMoreEvents,
    toggle: toggleShowMoreEvents,
  } = useShowHide();

  const renderEvents = useMemo(() => {
    if (showMoreEvents) {
      return events.map((event) => (
        <ScheduleItemNG key={event.id} event={event} isLive={isLive} />
      ));
    }

    return events
      .slice(0, EVENTS_PREVIEW_LIST_LENGTH)
      .map((event) => (
        <ScheduleItemNG key={event.id} event={event} isLive={isLive} />
      ));
  }, [events, showMoreEvents, isLive]);

  const hasEvents = events.length > 0;
  const shouldShowMoreEvents = events.length > EVENTS_PREVIEW_LIST_LENGTH;

  return (
    <>
      {hasEvents && (
        <div className="ScheduleEventSubListNG__title">{title}</div>
      )}
      {renderEvents}
      {shouldShowMoreEvents && (
        <div
          className="ScheduleEventSubListNG__button"
          onClick={toggleShowMoreEvents}
        >
          {showMoreEvents
            ? "Show less"
            : `Show more (${events.length - EVENTS_PREVIEW_LIST_LENGTH})`}
        </div>
      )}
    </>
  );
};
