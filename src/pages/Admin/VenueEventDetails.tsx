import React from "react";
import { format, getUnixTime } from "date-fns";

import { VenueEvent } from "types/venues";

import { WithId } from "utils/id";
import { formatHourAndMinute, getTimeBeforeParty } from "utils/time";
import { eventEndTime, eventStartTime } from "utils/event";

export interface VenueEventDetailsProps {
  venueEvent: WithId<VenueEvent>;
  setEditedEvent: Function | undefined;
  setShowCreateEventModal: Function;
  setShowDeleteEventModal: Function;
  className: string;
}

const VenueEventDetails = ({
  venueEvent,
  setEditedEvent,
  setShowCreateEventModal,
  setShowDeleteEventModal,
  className,
}: VenueEventDetailsProps) => {
  const startTime = formatHourAndMinute(venueEvent.start_utc_seconds);
  const endTime = formatHourAndMinute(getUnixTime(eventEndTime(venueEvent)));
  const startDay = format(eventStartTime(venueEvent), "EEEE LLLL do");
  console.log("here");

  return (
    <div className={className}>
      <div className="date">{`${startTime}-${endTime} ${startDay}`}</div>
      <div className="event-description">
        <div style={!className ? { display: "none" } : {}}>
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
        {venueEvent.description}
        <br />
        {getTimeBeforeParty(venueEvent.start_utc_seconds)}

        {venueEvent.descriptions?.map((description, index) => (
          <p key={index}>{description}</p>
        ))}
      </div>
      <div className="button-container">
        <div className="price-container">
          {venueEvent.price > 0 && (
            <>Individual tickets £{venueEvent.price / 100}</>
          )}
        </div>
        {!className && (
          <div className="event-payment-button-container">
            <div>
              <button
                role="link"
                className="btn btn-primary buy-tickets-button"
                onClick={() => {
                  setEditedEvent && setEditedEvent(venueEvent);
                  setShowCreateEventModal(true);
                }}
              >
                Edit
              </button>
              <button
                role="link"
                className="btn btn-primary buy-tickets-button"
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
