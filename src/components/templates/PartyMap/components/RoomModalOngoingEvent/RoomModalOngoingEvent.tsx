import React from "react";

import { SPARKLE_ICON } from "settings";

import { VenueEvent } from "types/venues";

import { getCurrentEvent } from "utils/event";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./RoomModalOngoingEvent.scss";

export interface RoomModalOngoingEventProps {
  roomEvents: VenueEvent[];
}

export const RoomModalOngoingEvent: React.FC<RoomModalOngoingEventProps> = ({
  roomEvents,
}) => {
  const currentEvent = roomEvents && getCurrentEvent(roomEvents);
  const eventToDisplay =
    roomEvents &&
    roomEvents.length > 0 &&
    (currentEvent ? currentEvent : roomEvents[0]);

  return (
    <div className="room-modal-ongoing-event-container">
      {eventToDisplay && (
        <>
          <div className="title-container">
            <img
              src={SPARKLE_ICON}
              className="sparkle-icon"
              alt="sparkle-icon"
            />
            {currentEvent ? "What's on now" : "What's on next"}
          </div>

          <div className="artist-ongoing-container">
            <div className="event-title">{eventToDisplay.name}</div>
            <div>
              by <span className="artist-name">{eventToDisplay.host}</span>
            </div>
          </div>

          <div className="event-description">
            <RenderMarkdown text={eventToDisplay.description} />
          </div>
        </>
      )}
    </div>
  );
};
