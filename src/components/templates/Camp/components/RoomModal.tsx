import React from "react";
import { getCurrentEvent } from "utils/event";
import { RoomModalOngoingEvent } from "./RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import { ScheduleItem } from "./ScheduleItem";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Modal } from "react-bootstrap";
import { CampRoomData } from "types/CampRoomData";

import "../../../templates/PartyMap/RoomModal/RoomModal.scss";
import { currentTimeInUnixEpoch, ONE_MINUTE_IN_SECONDS } from "utils/time";
import { useFirestoreConnect } from "react-redux-firebase";
import {
  currentVenueEventsNGLegacyWorkaroundSelector,
  currentVenueNGLegacyWorkaroundSelector,
} from "hooks/useConnectCurrentVenueNG";
import { partygoersSelector, venuesOrderedSelector } from "utils/selectors";

interface PropsType {
  show: boolean;
  onHide: () => void;
  room: CampRoomData | undefined;
  joinButtonText?: string;
}

export const RoomModal: React.FC<PropsType> = ({
  show,
  onHide,
  room,
  joinButtonText,
}) => {
  useFirestoreConnect("venues");
  const { user, profile } = useUser();

  const venue = useSelector(currentVenueNGLegacyWorkaroundSelector);
  const venueEvents = useSelector(currentVenueEventsNGLegacyWorkaroundSelector);
  const venues = useSelector(venuesOrderedSelector);
  const users = useSelector(partygoersSelector);

  if (!room) {
    return <></>;
  }

  const usersToDisplay = users
    ? users.filter(
        (user) =>
          user.lastSeenIn && user.lastSeenIn[`${venue?.name}/${room?.title}`]
      )
    : [];

  const enter = () => {
    const roomVenue = venues?.find((venue) =>
      room.url.endsWith(`/${venue.id}`)
    );
    const venueRoom = roomVenue
      ? { [roomVenue.name]: currentTimeInUnixEpoch }
      : {};
    room &&
      user &&
      enterRoom(
        user,
        {
          [`${venue.name}/${room?.title}`]: currentTimeInUnixEpoch,
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
          currentTimeInUnixEpoch
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
