import React from "react";
import { Modal } from "react-bootstrap";

import { currentTimeInUnixEpoch, getCurrentEvent } from "utils/time";
import { enterRoom } from "utils/useLocationUpdateEffect";

import { isPartyMapVenue } from "types/PartyMapVenue";
import { RoomData } from "types/RoomData";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import UserList from "components/molecules/UserList";

import { RoomModalOngoingEvent } from "../components";
import { ScheduleItem } from "../components";

import "./RoomModal.scss";
import { partygoersSelector } from "utils/selectors";
import { currentVenueNGLegacyWorkaroundSelector } from "hooks/useConnectCurrentVenueNG";

interface PropsType {
  show: boolean;
  onHide: () => void;
  room: RoomData | undefined;
}

export const RoomModal: React.FC<PropsType> = ({ show, onHide, room }) => {
  const { user, profile } = useUser();

  const venue = useSelector(currentVenueNGLegacyWorkaroundSelector);
  const users = useSelector(partygoersSelector);

  if (!isPartyMapVenue(venue)) {
    return <></>;
  }

  const usersToDisplay =
    users?.filter((user) => user.room === `${venue.name}/${room?.title}`) ?? [];

  function enter() {
    room &&
      user &&
      enterRoom(
        user,
        { [`${venue.name}/${room?.title}`]: currentTimeInUnixEpoch },
        profile?.lastSeenIn
      );
  }

  if (!room) return <></>;

  const currentEvent =
    room.events && getCurrentEvent(room, venue.start_utc_seconds);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="container room-container">
        <div className="room-description">
          <div className="title-container">
            <h2 className="room-modal-title">{room.title}</h2>
            <div className="room-modal-subtitle">{room.subtitle}</div>
            <div className="row ongoing-event-row">
              <div className="col">
                {room.image && (
                  <img
                    src={`/room-images/${room.image}`}
                    className="room-page-image"
                    alt={room.title}
                  />
                )}
                {!room.image && room.title}
              </div>
              <div className="col">
                <RoomModalOngoingEvent
                  room={room}
                  enterRoom={enter}
                  startUtcSeconds={venue.start_utc_seconds}
                />
              </div>
            </div>
          </div>
        </div>
        <UserList users={usersToDisplay} limit={11} activity="in this room" />
        {room.about && <div className="about-this-room">{room.about}</div>}
        <div className="row">
          {room.events && room.events.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {room.events.map((event, idx: number) => (
                <ScheduleItem
                  key={idx}
                  startUtcSeconds={venue.start_utc_seconds}
                  event={event}
                  isCurrentEvent={
                    currentEvent && event.name === currentEvent.name
                  }
                  enterRoom={enter}
                  roomUrl={room.external_url}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
