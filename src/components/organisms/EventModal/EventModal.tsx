import React, { useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import { VenueEvent } from "types/venues";
import { Room } from "types/rooms";

import { WithVenueId } from "utils/id";
import { enterVenue } from "utils/url";
import { hasEventFinished, isEventLive } from "utils/event";
import { formatUtcSecondsRelativeToNow } from "utils/time";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";

import { Button } from "components/atoms/Button";

import "./EventModal.scss";

const emptyRoom: Room = {
  title: "",
  subtitle: "",
  url: "",
  about: "",
  x_percent: 0,
  y_percent: 0,
  width_percent: 0,
  height_percent: 0,
  isEnabled: false,
  image_url: "",
};

export interface EventModalProps {
  show: boolean;
  onHide: () => void;
  event: WithVenueId<VenueEvent>;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onHide,
  show,
}) => {
  const { currentVenue: eventVenue } = useRelatedVenues({
    currentVenueId: event.venueId,
  });

  const eventRoom = useMemo(
    () =>
      eventVenue?.rooms?.find((room) => room.title === event.room) ?? emptyRoom,
    [eventVenue, event]
  );

  const { enterRoom } = useRoom({
    room: eventRoom,
    venueName: eventVenue?.name ?? "",
  });

  const eventLocationToDisplay = event.room
    ? event.room
    : eventVenue?.name ?? event.venueId;

  const goToEventLocation = () => {
    onHide();

    if (event.room) {
      enterRoom();
    } else {
      enterVenue(event.venueId);
    }
  };

  const isLive = isEventLive(event);

  const getEventStatus = () => {
    if (isLive) return `Happening now`;

    if (hasEventFinished(event)) {
      return `Ended`;
    } else {
      return `Starts ${formatUtcSecondsRelativeToNow(event.start_utc_seconds)}`;
    }
  };

  return (
    <Modal show={show} onHide={onHide} className="EventModal">
      <div className="EventModal__content">
        <h4 className="EventModal__title">{event.name}</h4>
        <span className="EventModal__subtitle">
          by {event.host} in{" "}
          <button className="button--a" onClick={goToEventLocation}>
            {eventLocationToDisplay}
          </button>
        </span>

        <p className="EventModal__description">{event.description}</p>

        <Button
          customClass="EventModal__button"
          onClick={goToEventLocation}
          disabled={!isLive}
        >
          {getEventStatus()} in the {eventLocationToDisplay}
        </Button>
      </div>
    </Modal>
  );
};
