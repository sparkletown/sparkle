import React from "react";
import RoomModalOngoingEvent from "components/templates/PartyMap/components/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import ScheduleItem from "components/templates/PartyMap/components/ScheduleItem";
import { enterRoom } from "utils/useLocationUpdateEffect";
import "./RoomModal.scss";
import { isPartyMapVenue, isPartyMapEvent } from "types/PartyMapVenue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import { Modal } from "react-bootstrap";
import { Venue } from "types/Venue";
import { getCurrentEvent } from "../components/RoomList/RoomList";

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

  const partyMapSubVenue =
    isPartyMapEvent(event) &&
    (event.sub_venues.find((v) => v.id === venue.name) ?? false);
  const currentEvent =
    (partyMapSubVenue &&
      getCurrentEvent(partyMapSubVenue, event.start_utc_seconds)) ||
    false;

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
                <RoomModalOngoingEvent
                  venue={venue}
                  displayedEvent={currentEvent}
                  enterRoom={enter}
                  startUtcSeconds={event?.start_utc_seconds}
                />
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
          {partyMapSubVenue && partyMapSubVenue.schedule.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {partyMapSubVenue.schedule.map((scheduleItem, idx: number) => (
                <ScheduleItem
                  key={idx}
                  startUtcSeconds={event.start_utc_seconds} // @debt - ???
                  scheduleItem={scheduleItem}
                  isCurrentEvent={
                    currentEvent && event.name === currentEvent.name
                  }
                  enterRoom={enter}
                  roomUrl={"createVenueUrl(venue)"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;
