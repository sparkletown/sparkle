import React, { useMemo, useState } from "react";
import classNames from "classnames";

import { AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";

import { EventDisplay } from "components/molecules/EventDisplay/EventDisplay";

import "./EventRoomDisplay.scss";

export interface EventRoomDisplayProps {
  title?: string;
  events?: Array<WithVenueId<VenueEvent>>;
  venue?: WithId<AnyVenue>;
}

export const EventRoomDisplay: React.FC<EventRoomDisplayProps> = ({
  title,
  events,
  venue,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const containerClasses = classNames("event-show-bar", {
    "event-show-bar--selected": isSelected,
  });

  const eventsToShow = useMemo(
    () =>
      events?.map((event, index) => (
        <EventDisplay
          key={event.id ?? `${index}-${event.name}`}
          event={event}
          venue={venue}
        />
      )),
    [events, venue]
  );

  if (events?.length === 0) {
    return <></>;
  }

  return (
    <div
      className={"schedule-time-line"}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(!isSelected);
      }}
    >
      <div className="shcedule-time-line-room">
        <div className={"event-room"}>
          <div className={"schedule-event-info-title"}>{title}</div>
          <div className={"schedule-event-info-description"}>
            {events?.length} events
          </div>
          <div className={"event-room-button-container"}>
            {isSelected && (
              <div
                className={"event-room-button"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Add to calendar
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={containerClasses}>{eventsToShow}</div>
    </div>
  );
};
