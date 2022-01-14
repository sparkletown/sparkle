import React, { useMemo } from "react";

import { EVENTS_PREVIEW_LIST_LENGTH } from "settings";

import { ScheduledEvent } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { ScheduleItem } from "components/molecules/ScheduleItem";

import "./ScheduleEventList.scss";

interface ScheduleEventSubListProps {
  events: ScheduledEvent[];
  title: string;
  isShowFullInfo?: boolean;
}

export const ScheduleEventSubList: React.FC<ScheduleEventSubListProps> = ({
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
      <ScheduleItem
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
      {hasEvents && <div className="ScheduleEventSubList__title">{title}</div>}
      {renderEvents}
      {shouldShowMoreEvents && (
        <div
          className="ScheduleEventSubList__button"
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
