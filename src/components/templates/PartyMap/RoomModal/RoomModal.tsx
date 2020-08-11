import React from "react";
import { getCurrentEvent } from "utils/time";
import RoomModalOngoingEvent from "components/templates/PartyMap/components/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import ScheduleItem from "components/templates/PartyMap/components/ScheduleItem";
import { enterRoom } from "utils/useLocationUpdateEffect";
import "./RoomModal.scss";
import { isPartyMapVenue } from "types/PartyMapVenue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Modal } from "react-bootstrap";
import { RoomData } from "types/RoomData";
import { Venue } from "types/Venue";

interface PropsType {
  show: boolean;
  onHide: () => void;
  venue: Venue | undefined;
}

const RoomModal: React.FC<PropsType> = ({ show, onHide, venue }) => {
  const { user } = useUser();
  const { event, users, parentVenue } = useSelector((state) => ({
    event: state.firestore.ordered.currentEvent?.[0],
    parentVenue: state.firestore.ordered.currentVenue?.[0],
    users: state.firestore.ordered.partygoers,
  }));

  if (!isPartyMapVenue(parentVenue)) {
    return <></>;
  }

  if (!venue) return <></>;

  const usersToDisplay =
    users?.filter((user) => user.room === venue.name) ?? [];

  function enter() {
    venue && user && enterRoom(user, venue.name);
  }

  // this will be the schedule, not yet implemented
  // const currentEvent =
  //   room.events && getCurrentEvent(room, event?.start_utc_seconds);

  return (
    <Modal show={show} onHide={onHide}>
      <div className="container room-container">
        <div className="room-description">
          <div className="title-container">
            <h2 className="room-modal-title">{venue.name}</h2>
            <div className="room-modal-subtitle">
              This is a harcoded subtitle because it is not part of the Venue
              Model
            </div>
            <div className="row ongoing-event-row">
              <div className="col">
                {venue.mapIconImageUrl && (
                  <img
                    src={venue.mapIconImageUrl}
                    className="room-page-image"
                    alt={venue.name}
                  />
                )}
              </div>
              <div className="col">
                {/* <RoomModalOngoingEvent
                  room={room}
                  enterRoom={enter}
                  startUtcSeconds={event?.start_utc_seconds}
                /> */}
              </div>
            </div>
          </div>
        </div>
        <UserList users={usersToDisplay} limit={11} activity="in this room" />
        <div className="about-this-room">
          This is a harcoded description because it is not part of the Venue
          Model
        </div>
        <div className="row">
          {/* {event.schedule && event.schedule.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {event.schedule.map((scheduleItem, idx: number) => (
                <ScheduleItem
                  key={idx}
                  startUtcSeconds={scheduleItem.start_utc_seconds}
                  event={event}
                  isCurrentEvent={
                    currentEvent && event.name === currentEvent.name
                  }
                  enterRoom={enter}
                  roomUrl={room.external_url}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;
