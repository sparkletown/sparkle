import React, { useState } from "react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

import { WorldId } from "types/id";
import { WorldEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatTimeLocalised } from "utils/time";

import { useOwnedVenues } from "hooks/useOwnedVenues";
import { useUser } from "hooks/useUser";

export type TimingEventProps = {
  event: WorldEvent;
  worldId?: WorldId;
  setShowCreateEventModal: () => void;
  setEditedEvent: (event: WorldEvent) => void;
};

export const TimingEvent: React.FC<TimingEventProps> = ({
  event,
  worldId,
  setShowCreateEventModal,
  setEditedEvent,
}) => {
  const [display, setDisplay] = useState(false);

  const { userId } = useUser();

  const { ownedVenues } = useOwnedVenues({ worldId, userId });
  const space = ownedVenues.find((space) => space.id === event.spaceId);

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
        <p>{format(eventStartTime({ event }), "do MMM")}</p>
        <p className="TimingEvent__time-start">
          {formatTimeLocalised(eventStartTime({ event }))}
        </p>
        <p>{formatTimeLocalised(eventEndTime({ event }))}</p>
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
