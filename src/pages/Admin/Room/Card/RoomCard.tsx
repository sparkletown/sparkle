import React from "react";

import { RoomCardProps } from "./RoomCard.types";

import * as S from "./RoomCard.styles";
import Button from "components/atoms/Button";
import { useSelector } from "hooks/useSelector";
import VenueEventDetails from "pages/Admin/VenueEventDetails";
import { Card } from "react-bootstrap";

const RoomCard: React.FC<RoomCardProps> = ({
  title,
  description,
  image_url,
  editHandler,
  onEventHandler,
}) => {
  const events = useSelector((state) => state.firestore.ordered.events);
  const filteredEvents =
    events &&
    events.filter((e) => {
      if (e.room === title) {
        return e;
      }
      return null;
    });

  const renderFilteredEvents = () => {
    return filteredEvents?.map((venueEvent) => (
      <VenueEventDetails
        key={venueEvent.id}
        venueEvent={venueEvent}
        setEditedEvent={() => {}}
        setShowCreateEventModal={() => {}}
        setShowDeleteEventModal={() => {}}
        className="admin-room-list-events"
      />
    ));
  };

  return (
    <S.Wrapper>
      <S.Header>
        <S.Banner>
          <img src={image_url} alt="Room banner" />
        </S.Banner>

        <S.TitleWrapper>
          <S.Title>{title}</S.Title>
          <S.Description>{description}</S.Description>
        </S.TitleWrapper>

        <S.ButtonWrapper>
          <Button text="Edit room" onClick={() => editHandler()} />
        </S.ButtonWrapper>
      </S.Header>

      <Card.Subtitle>Events</Card.Subtitle>
      {!filteredEvents || !filteredEvents.length ? (
        <S.EventWrapper>No events yet</S.EventWrapper>
      ) : (
        renderFilteredEvents()
      )}
      <Button text="Add an event" onClick={() => onEventHandler(title)} />
    </S.Wrapper>
  );
};

export default RoomCard;
