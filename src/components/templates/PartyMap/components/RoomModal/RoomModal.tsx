import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { isBefore } from "date-fns";

import { Room, RoomType } from "types/rooms";
import { AnyVenue } from "types/venues";

import { eventEndTime, getCurrentEvent } from "utils/event";
import { WithId } from "utils/id";

import { useCustomSound } from "hooks/sounds";
import { useRoom } from "hooks/useRoom";
import { useVenueEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import VideoModal from "components/organisms/VideoModal";

import { UserList } from "components/molecules/UserList";

import { RoomModalOngoingEvent, ScheduleItem } from "..";

import "./RoomModal.scss";

export interface RoomModalProps {
  onHide: () => void;
  show: boolean;
  venue?: WithId<AnyVenue>;
  room?: Room;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  onHide,
  room,
  show,
  venue,
}) => {
  if (!venue || !room) return null;

  if (room.type === RoomType.modalFrame) {
    return (
      <VideoModal
        show={show}
        onHide={onHide}
        caption={room.title}
        url={room.url}
        autoplay
        backdrop
      />
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <div className="room-modal">
        <RoomModalContent room={room} venue={venue} />
      </div>
    </Modal>
  );
};

export interface RoomModalContentProps {
  room: Room;
  venue: WithId<AnyVenue>;
}

export const RoomModalContent: React.FC<RoomModalContentProps> = ({
  room,
  venue,
}) => {
  const venueName = venue.name;

  const { relatedVenueIds } = useRelatedVenues({ currentVenueId: venue.id });

  const venueIds = useMemo(() => relatedVenueIds, [relatedVenueIds]);

  const { events: venueEvents } = useVenueEvents({ venueIds: venueIds });

  const { enterRoom, recentRoomUsers } = useRoom({ room, venueName });

  const [enterRoomWithSound] = useCustomSound(room.enterSound, {
    interrupt: true,
    onend: enterRoom,
  });

  const roomEvents = useMemo(() => {
    if (!venueEvents) return [];

    return venueEvents
      .filter(
        (event) =>
          event.room === room.title && isBefore(Date.now(), eventEndTime(event))
      )
      .sort((a, b) => a.start_utc_seconds - b.start_utc_seconds);
  }, [room, venueEvents]);

  const currentEvent = getCurrentEvent(roomEvents);

  const renderedRoomEvents = useMemo(
    () =>
      roomEvents.map((event, index: number) => (
        <ScheduleItem
          // @debt Ideally event.id would always be a unique identifier, but our types suggest it
          //   can be undefined. Because we can't use index as a key by itself (as that is unstable
          //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
          //   is far less likely to clash
          key={event.id ?? `${event.room}-${event.name}-${index}`}
          event={event}
          isCurrentEvent={currentEvent && event.name === currentEvent.name}
          onRoomEnter={enterRoomWithSound}
          roomUrl={room.url}
        />
      )),
    [currentEvent, enterRoomWithSound, room.url, roomEvents]
  );

  const hasRoomEvents = renderedRoomEvents?.length > 0;

  const iconStyles = {
    backgroundImage: room.image_url ? `url(${room.image_url})` : undefined,
  };

  return (
    <>
      <h2>{room.title}</h2>

      {room.subtitle && (
        <div className="room-modal__title">{room.subtitle}</div>
      )}

      <div className="room-modal__main">
        <div className="room-modal__icon" style={iconStyles} />

        <RoomModalOngoingEvent
          roomEvents={roomEvents}
          onRoomEnter={enterRoomWithSound}
        />
      </div>

      <UserList
        users={recentRoomUsers}
        limit={11}
        activity="in this room"
        attendanceBoost={room.attendanceBoost}
      />

      {room.about && (
        <div className="room-modal__description">
          <RenderMarkdown text={room.about} />
        </div>
      )}

      {hasRoomEvents && (
        <div className="room-modal__events">
          <div className="room-modal__title">Room Schedule</div>

          {renderedRoomEvents}
        </div>
      )}
    </>
  );
};
