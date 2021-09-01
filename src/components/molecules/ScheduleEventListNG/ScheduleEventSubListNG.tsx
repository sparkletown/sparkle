import React, { useMemo } from "react";

import { EVENTS_PREVIEW_LIST_LENGTH } from "settings";

import { ScheduledVenueEvent } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { ScheduleItemNG } from "components/molecules/ScheduleItemNG";

import "./ScheduleEventListNG.scss";

export interface ScheduleEventSubListNGProps {
  events: ScheduledVenueEvent[];
  title: string;
  isShowFullInfo?: boolean;
}

export const ScheduleEventSubListNG: React.FC<ScheduleEventSubListNGProps> = ({
  events,
  title,
  isShowFullInfo = true,
}) => {
  const {
    isShown: showMoreEvents,
    toggle: toggleShowMoreEvents,
  } = useShowHide();

  const renderEvents = useMemo(() => {
    let eventsToRender = events;

    if (!showMoreEvents) {
      eventsToRender = events.slice(0, EVENTS_PREVIEW_LIST_LENGTH);
    }

    return eventsToRender.map((event) => (
      <ScheduleItemNG
        key={event.id}
        event={event}
        isShowFullInfo={isShowFullInfo}
      />
    ));
  }, [events, showMoreEvents, isShowFullInfo]);

  const hasEvents = events.length > 0;
  const shouldShowMoreEvents = events.length > EVENTS_PREVIEW_LIST_LENGTH;

  return (
    <>
      {hasEvents && (
        <div className="ScheduleEventSubListNG__title">{title}</div>
      )}
      {hasEvents && (
        <div className="ScheduleEventSubListNG__subtitle">
          Times displayed below are your local time
        </div>
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
