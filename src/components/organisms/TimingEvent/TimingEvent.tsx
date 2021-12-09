import React, { useState } from "react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { WithId, WithVenueId } from "utils/id";
import { formatTimeLocalised } from "utils/time";

import { useRelatedVenues } from "hooks/useRelatedVenues";

export type TimingEventProps = {
  event: WithVenueId<WithId<VenueEvent>>;
  setShowCreateEventModal: () => void;
  setEditedEvent: (event: WithVenueId<WithId<VenueEvent>>) => void;
};

export const TimingEvent: React.FC<TimingEventProps> = ({
  event,
  setShowCreateEventModal,
  setEditedEvent,
}) => {
  const [display, setDisplay] = useState(false);

  const { findVenueInRelatedVenues } = useRelatedVenues();
  const space = findVenueInRelatedVenues({ spaceId: event.spaceId });

  const showButton = (e: React.MouseEvent) => {
    e.preventDefault();
    setDisplay(true);
  };
  const hideButton = (e: React.MouseEvent) => {
    e.preventDefault();
    setDisplay(false);
  };

  return (
    <div
      key={event.id}
      className="TimingEvent"
      onMouseEnter={showButton}
      onMouseLeave={hideButton}
    >
      <div className="TimingEvent__time">
        <p>{format(eventStartTime(event), "do MMM")}</p>
        <p className="TimingEvent__time-start">
          {formatTimeLocalised(eventStartTime(event))}
        </p>
        <p>{formatTimeLocalised(eventEndTime(event))}</p>
      </div>
      <div className="TimingEvent__details">
        <p>
          <span className="TimingEvent__details-name">{event.name}</span> by{" "}
          <span className="TimingEvent__details-host">{event.host}</span>
        </p>
        <p className="TimingEvent__details-description">{event.description}</p>
        <p className="TimingEvent__details-room">
          in <span className="event-details-room-name">{space?.name}</span>
        </p>
      </div>

      {display && (
        <button
          className="TimingEvent__edit-button"
          onClick={() => {
            setShowCreateEventModal();
            setEditedEvent(event);
          }}
        >
          <FontAwesomeIcon
            icon={faPen}
            className="TimingEvent__edit-button__icon"
            size="lg"
          />
        </button>
      )}
    </div>
  );
};
