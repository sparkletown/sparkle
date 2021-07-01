import React, { useState } from "react";
import { WithId } from "utils/id";
import { VenueEvent } from "types/venues";
import { formatTimeLocalised } from "utils/time";
import { format } from "date-fns";
import { eventStartTime, eventEndTime } from "utils/event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { WithId } from "utils/id";
import { formatTimeLocalised } from "utils/time";
import { eventStartTime, eventEndTime } from "utils/event";

import { VenueEvent } from "types/venues";


export type TimingEventProps = {
  event: WithId<VenueEvent>;
  setShowCreateEventModal: Function;
  setEditedEvent: Function;
};

export const TimingEvent: React.FC<TimingEventProps> = ({
  event,
  setShowCreateEventModal,
  setEditedEvent,
}) => {
  const [display, setDisplay] = useState("hidden");

  const showButton = (e: React.MouseEvent) => {
    e.preventDefault();
    setDisplay("shown");
  };
  const hideButton = (e: React.MouseEvent) => {
    e.preventDefault();
    setDisplay("hidden");
  };

  return (
    <div
      key={event.id}
      className="event"
      onMouseEnter={(e) => showButton(e)}
      onMouseLeave={(e) => hideButton(e)}
    >
      <div className="event-time">
        <p>{format(eventStartTime(event), "do MMM")}</p>
        <p className="event-time__start">
          {formatTimeLocalised(eventStartTime(event))}
        </p>
        <p>{formatTimeLocalised(eventEndTime(event))}</p>
      </div>
      <div className="event-details">
        <p>
          <span className="event-details__name">{event.name}</span> by{" "}
          <span className="event-details__host">{event.host}</span>
        </p>
        <p className="event-details__description">{event.description}</p>
        <p className="event-details__room">
          in <span className="event-details__room--name">{event.room}</span>
        </p>
      </div>
      <button
        className={"edit-button " + display}
        onClick={() => {
          setShowCreateEventModal(true);
          setEditedEvent(event);
        }}
      >
        <FontAwesomeIcon icon={faPen} className="edit-button__icon" size="lg" />
      </button>
    </div>
  );
};
