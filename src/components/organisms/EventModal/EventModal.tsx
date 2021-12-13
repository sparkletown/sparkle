import React, { useMemo, useState } from "react";
import ReactModal from "react-modal";

import { EVENT_STATUS_REFRESH_MS } from "settings";

import { Room } from "types/rooms";
import { VenueEvent } from "types/venues";

import { getEventStatus, isEventLive } from "utils/event";
import { WithVenueId } from "utils/id";
import {
  enterSpace,
  getLastUrlParam,
  getUrlParamFromString,
  getUrlWithoutTrailingSlash,
  openUrl,
} from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useInterval } from "hooks/useInterval";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./EventModal.scss";

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
  const { worldSlug } = useSpaceParams();

  const eventRoom = useMemo<Room | undefined>(
    () =>
      eventVenue?.rooms?.find((room) => {
        const { room: eventRoom = "" } = event;
        const noTrailSlashUrl = getUrlWithoutTrailingSlash(room.url);

        const [roomName] = getLastUrlParam(noTrailSlashUrl);
        const roomUrlParam = getUrlParamFromString(eventRoom);
        const selectedRoom = getUrlParamFromString(room.title) === eventRoom;

        return roomUrlParam.endsWith(`${roomName}`) || selectedRoom;
      }),
    [eventVenue, event]
  );

  const { enterRoom } = useRoom({
    room: eventRoom,
  });

  const eventLocationToDisplay =
    (event.room || eventVenue?.name) ?? event.venueId;

  const goToEventLocation = () => {
    onHide();

    const { room = "" } = event;
    const roomUrlParam = getUrlParamFromString(room);

    if (!eventRoom) {
      openUrl(roomUrlParam);

      return;
    }

    if (event.room) {
      enterRoom();
    } else {
      enterSpace(worldSlug, eventVenue?.slug);
    }
  };

  const isLive = isEventLive(event);

  const [eventStatus, setEventStatus] = useState(getEventStatus(event));
  useInterval(
    () => setEventStatus(getEventStatus(event)),
    EVENT_STATUS_REFRESH_MS
  );

  return (
    <ReactModal isOpen={show} onAfterClose={onHide} className="EventModal">
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

        <ButtonNG
          className="EventModal__button"
          onClick={goToEventLocation}
          disabled={!isLive}
        >
          {eventStatus} in the {eventLocationToDisplay}
        </ButtonNG>
      </div>
    </ReactModal>
  );
};
