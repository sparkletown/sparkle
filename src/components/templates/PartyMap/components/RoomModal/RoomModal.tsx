import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";

import { Room } from "types/rooms";
import { AnyVenue } from "types/venues";

import { getCurrentEvent } from "utils/event";
import { venueEventsSelector } from "utils/selectors";
import {
  getCurrentTimeInUnixEpochSeconds,
  ONE_MINUTE_IN_SECONDS,
} from "utils/time";

import { useCustomSound } from "hooks/sounds";
import { useSelector } from "hooks/useSelector";
import { useRoom } from "hooks/useRoom";

import UserList from "components/molecules/UserList";

import { RoomModalOngoingEvent, ScheduleItem } from "..";

import "./RoomModal.scss";

export interface RoomModalProps {
  onHide: () => void;
  show: boolean;
  venue?: AnyVenue;
  room?: Room;
}

export interface RoomModalContentProps {
  room: Room;
  venueName: string;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  onHide,
  room,
  show,
  venue,
}) => (
  <Modal show={show} onHide={onHide}>
    <div className="room-modal">
      {room && venue && <RoomModalContent room={room} venueName={venue.name} />}
    </div>
  </Modal>
);

export const RoomModalContent: React.FC<RoomModalContentProps> = ({
  room,
  venueName,
}) => {
  const venueEvents = useSelector(venueEventsSelector) ?? [];

  const { enterRoom, recentRoomUsers } = useRoom({ room, venueName });

  const [enterRoomWithSound] = useCustomSound(room.enterSound, {
    interrupt: true,
    onend: enterRoom,
  });

  const roomEvents = useMemo(
    () =>
      venueEvents.filter(
        (event) =>
          event.room === room.title &&
          event.start_utc_seconds +
            event.duration_minutes * ONE_MINUTE_IN_SECONDS >
            getCurrentTimeInUnixEpochSeconds()
      ),
    [room, venueEvents]
  );

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
        <div className="room-modal__description">{room.about}</div>
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
