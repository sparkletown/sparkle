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

import { useSelector } from "hooks/useSelector";
import { useMousetrap } from "hooks/useMousetrap";
import { useRoom } from "hooks/useRoom";

import UserList from "components/molecules/UserList";

import { RoomModalOngoingEvent, ScheduleItem } from "..";

import "./RoomModal.scss";

export interface RoomModalProps {
  onHide: () => void;
  show: boolean;
  currentVenue?: AnyVenue;
  room?: Room;
}

export interface RoomModalContentProps {
  room: Room;
  currentVenueName: string;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  onHide,
  room,
  show,
  currentVenue,
}) => {
  if (!room || !currentVenue) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <RoomModalContent room={room} currentVenueName={currentVenue.name} />
    </Modal>
  );
};

export const RoomModalContent: React.FC<RoomModalContentProps> = ({
  room,
  currentVenueName,
}) => {
  const venueEvents = useSelector(venueEventsSelector) ?? [];

  const { enterRoom, recentRoomUsers } = useRoom(room, currentVenueName);

  useMousetrap({
    keys: "enter",
    callback: enterRoom,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
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

  const currentEvent = roomEvents && getCurrentEvent(roomEvents);

  return (
    <div className="container room-modal-container">
      <div className="room-description">
        <div className="title-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            <h2 className="room-modal-title">{room.title}</h2>
            <div className="room-modal-subtitle">{room.subtitle}</div>
          </div>

          <div className="row ongoing-event-row">
            <div className="col">
              {room.image_url && (
                <img
                  src={room.image_url}
                  className="room-page-image"
                  alt={room.title}
                />
              )}
              {!room.image_url && room.title}
            </div>
            <div className="col">
              <RoomModalOngoingEvent
                roomEvents={roomEvents}
                onRoomEnter={enterRoom}
              />
            </div>
          </div>
        </div>
      </div>

      <UserList
        users={recentRoomUsers}
        limit={11}
        activity="in this room"
        attendanceBoost={room.attendanceBoost}
      />

      {room.about && <div className="about-this-room">{room.about}</div>}

      <div className="row">
        {roomEvents && roomEvents.length > 0 && (
          <div className="col schedule-container">
            <div className="schedule-title">Room Schedule</div>
            {roomEvents.map((event, index: number) => (
              <ScheduleItem
                // @debt Ideally event.id would always be a unique identifier, but our types suggest it
                //   can be undefined. Because we can't use index as a key by itself (as that is unstable
                //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
                //   is far less likely to clash
                key={event.id ?? `${event.room}-${event.name}-${index}`}
                event={event}
                isCurrentEvent={
                  currentEvent && event.name === currentEvent.name
                }
                onRoomEnter={enterRoom}
                roomUrl={room.url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
