import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { EVENT_STATUS_REFRESH_MS } from "settings";

import { WorldEvent } from "types/venues";

import { getEventStatus, isEventLive } from "utils/event";
import { enterSpace } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useInterval } from "hooks/useInterval";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ButtonOG } from "components/atoms/ButtonOG";

import "./EventModal.scss";

export interface EventModalProps {
  show: boolean;
  onHide: () => void;
  event: WorldEvent;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onHide,
  show,
}) => {
  const { currentVenue: eventVenue } = useRelatedVenues({
    currentVenueId: event.spaceId,
  });
  const { worldSlug } = useSpaceParams();

  const eventLocationToDisplay = eventVenue?.name ?? event.spaceId;

  const goToEventLocation = () => {
    onHide();
    enterSpace(worldSlug, eventVenue?.slug);
  };

  const isLive = isEventLive(event);

  const [eventStatus, setEventStatus] = useState(getEventStatus(event));
  useInterval(
    () => setEventStatus(getEventStatus(event)),
    EVENT_STATUS_REFRESH_MS
  );

  return (
    <Modal show={show} onHide={onHide} className="EventModal">
      <Modal.Header className="EventModal__close" closeButton />
      <div className="EventModal__content">
        <h4 className="EventModal__title">{event.name}</h4>
        <span className="EventModal__subtitle">
          by {event.host} in{" "}
          <button className="button--a" onClick={goToEventLocation}>
            {eventLocationToDisplay}
          </button>
        </span>

        <div className="EventModal__description">
          <RenderMarkdown text={event.description} />
        </div>

        <ButtonOG
          customClass="EventModal__button"
          onClick={goToEventLocation}
          disabled={!isLive}
        >
          {eventStatus} in the {eventLocationToDisplay}
        </ButtonOG>
      </div>
    </Modal>
  );
};
