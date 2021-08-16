import React, { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

import { ContainerClassName } from "types/utility";
import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { WithId } from "utils/id";
import { formatTimeLocalised } from "utils/time";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

export interface VenueEventDetailsProps
  extends ContainerClassName,
    VenueEventDetailsActions {
  venueEvent: WithId<VenueEvent>;
  isEditable?: boolean;
}

export interface VenueEventDetailsActions {
  setEditedEvent: Dispatch<SetStateAction<WithId<VenueEvent> | undefined>>;
  setShowCreateEventModal: (
    showCreateEventModal: boolean,
    roomName?: string
  ) => void;
  setShowDeleteEventModal: Dispatch<SetStateAction<boolean>>;
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
