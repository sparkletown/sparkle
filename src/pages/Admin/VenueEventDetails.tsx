import React from "react";
import { format } from "date-fns";

import { ContainerClassName } from "types/utility";
import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { WithId } from "utils/id";
import { formatTimeLocalised } from "utils/time";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

export interface VenueEventDetailsProps extends ContainerClassName {
  venueEvent: WithId<VenueEvent>;
  setEditedEvent: Function | undefined;
  setShowCreateEventModal: Function;
  setShowDeleteEventModal: Function;
  isEditable?: boolean;
}

const VenueEventDetails = ({
  venueEvent,
  setEditedEvent,
  setShowCreateEventModal,
  setShowDeleteEventModal,
  containerClassName = "",
  isEditable = false,
}: VenueEventDetailsProps) => {
  const startTime = formatTimeLocalised(eventStartTime(venueEvent));
  const endTime = formatTimeLocalised(eventEndTime(venueEvent));
  const startDay = format(eventStartTime(venueEvent), "EEEE LLLL do");

  return (
    <div className={containerClassName}>
      <div className="date">{`${startTime}-${endTime} ${startDay}`}</div>
      <div className="event-description">
        <div style={!containerClassName ? { display: "none" } : {}}>
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              setEditedEvent && setEditedEvent(venueEvent);
              setShowCreateEventModal(true);
            }}
          >
            {venueEvent.name}
          </span>
        </div>
        <RenderMarkdown text={venueEvent.description} />

        {venueEvent.descriptions?.map((description, index) => (
          <RenderMarkdown text={description} key={`${description}#${index}`} />
        ))}
      </div>
      <div className="button-container">
        {isEditable && (
          <div>
            <div>
              <button
                role="link"
                className="btn btn-primary"
                onClick={() => {
                  setEditedEvent && setEditedEvent(venueEvent);
                  setShowCreateEventModal(true);
                }}
              >
                Edit
              </button>
              <button
                role="link"
                className="btn btn-primary"
                onClick={() => {
                  setEditedEvent && setEditedEvent(venueEvent);
                  setShowDeleteEventModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueEventDetails;
