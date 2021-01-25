import React, { useCallback, useMemo } from "react";
import { Modal } from "react-bootstrap";

import { Room } from "types/rooms";

import { getCurrentEvent } from "utils/event";
import { trackRoomEntered } from "utils/useLocationUpdateEffect";
import {
  currentVenueSelector,
  orderedVenuesSelector,
  venueEventsSelector,
} from "utils/selectors";
import {
  getCurrentTimeInUnixEpochSeconds,
  ONE_MINUTE_IN_SECONDS,
} from "utils/time";

import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { usePartygoers } from "hooks/users";

import UserList from "components/molecules/UserList";

import { RoomModalOngoingEvent, ScheduleItem } from "..";

import "./RoomModal.scss";

interface RoomModalProps {
  show: boolean;
  onHide: () => void;
  room?: Room;
}

export const RoomModal: React.FC<RoomModalProps> = ({ show, onHide, room }) => {
  const { user, profile } = useUser();

  // const lastRoom = useRef(room);

  const venue = useSelector(currentVenueSelector);
  const venues = useSelector(orderedVenuesSelector);
  const venueEvents = useSelector(venueEventsSelector) ?? [];
  const users = usePartygoers();

  const venueName = venue?.name;
  const roomTitle = room?.title;
  const userLastSeenIn = profile?.lastSeenIn;

  const usersToDisplay = useMemo(
    () =>
      users?.filter((user) => user.lastSeenIn?.[`${venueName}/${roomTitle}`]),
    [users, venueName, roomTitle]
  );

  const roomVenue = useMemo(() => {
    if (!room) return undefined;

    return venues?.find((venue) => room.url.endsWith(`/${venue.id}`));
  }, [room, venues]);

  // TODO: @debt refactor this to use openRoomWithCounting
  const enter = useCallback(() => {
    if (!room || !user) return;

    const nowInEpochSeconds = getCurrentTimeInUnixEpochSeconds();

    const venueRoom = roomVenue ? { [roomVenue.name]: nowInEpochSeconds } : {};

    trackRoomEntered(
      user,
      {
        [`${venueName}/${roomTitle}`]: nowInEpochSeconds,
        ...venueRoom,
      },
      userLastSeenIn
    );
  }, [userLastSeenIn, room, roomTitle, roomVenue, user, venueName]);

  const roomEvents = useMemo(() => {
    if (!room) return [];

    return venueEvents.filter(
      (event) =>
        event.room === room.title &&
        event.start_utc_seconds +
          event.duration_minutes * ONE_MINUTE_IN_SECONDS >
          getCurrentTimeInUnixEpochSeconds()
    );
  }, [room, venueEvents]);

  const currentEvent = roomEvents && getCurrentEvent(roomEvents);

  // TODO: I believe this is what causes the room image to have to reload when the modal is closed, among other things
  //   We want the modal to remember it's last room so that it can keep it's data while hiding/similar
  if (!room) {
    return <></>;
  }

  return (
    <Modal show={show} onHide={onHide}>
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
                  room={room}
                  roomEvents={roomEvents}
                  enterRoom={enter}
                />
              </div>
            </div>
          </div>
        </div>

        <UserList
          users={usersToDisplay}
          limit={11}
          activity="in this room"
          attendanceBoost={room.attendanceBoost}
        />

        {room.about && <div className="about-this-room">{room.about}</div>}

        <div className="row">
          {roomEvents && roomEvents.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {roomEvents.map((event, idx: number) => (
                <ScheduleItem
                  key={idx}
                  event={event}
                  isCurrentEvent={
                    currentEvent && event.name === currentEvent.name
                  }
                  enterRoom={enter}
                  roomUrl={room.url}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
