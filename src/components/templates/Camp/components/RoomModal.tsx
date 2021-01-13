import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";

import { CampRoomData } from "types/CampRoomData";

import { getCurrentEvent } from "utils/event";
import { enterLocation } from "utils/useLocationUpdateEffect";
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
import { useFirestoreConnect } from "hooks/useFirestoreConnect";

import UserList from "components/molecules/UserList";

import { RoomModalOngoingEvent } from "./RoomModalOngoingEvent";
import { ScheduleItem } from "./ScheduleItem";

import "components/templates/PartyMap/components/RoomModal/RoomModal.scss";

interface RoomModalProps {
  show: boolean;
  onHide: () => void;
  room: CampRoomData | undefined;
  joinButtonText?: string;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  show,
  onHide,
  room,
  joinButtonText,
}) => {
  useFirestoreConnect("venues");
  const { user, profile } = useUser();

  const venue = useSelector(currentVenueSelector);
  const venues = useSelector(orderedVenuesSelector);
  const venueEvents = useSelector(venueEventsSelector) ?? [];
  const users = usePartygoers();
  const venueName = venue?.name;
  const roomTitle = room?.title;

  const usersToDisplay = useMemo(
    () =>
      users.filter((user) => user.lastSeenIn?.[`${venueName}/${roomTitle}`]),
    [users, venueName, roomTitle]
  );

  if (!room) {
    return <></>;
  }

  // @debt refactor this to use openRoomWithCounting (though this is getting deleted soon so might not matter)
  const enter = () => {
    const roomVenue = venues?.find((venue) =>
      room.url.endsWith(`/${venue.id}`)
    );

    const nowInEpochSeconds = getCurrentTimeInUnixEpochSeconds();

    const venueRoom = roomVenue ? { [roomVenue.name]: nowInEpochSeconds } : {};

    room &&
      user &&
      enterLocation(
        user,
        {
          [`${venue?.name}/${room?.title}`]: nowInEpochSeconds,
          ...venueRoom,
        },
        profile?.lastSeenIn
      );
  };

  const roomEvents =
    venueEvents &&
    venueEvents.filter(
      (event) =>
        event.room === room.title &&
        event.start_utc_seconds +
          event.duration_minutes * ONE_MINUTE_IN_SECONDS >
          getCurrentTimeInUnixEpochSeconds()
    );
  const currentEvent = roomEvents && getCurrentEvent(roomEvents);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="container room-container">
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
                  joinButtonText={joinButtonText}
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
