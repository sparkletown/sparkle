import React from "react";
import { useParams } from "react-router-dom";
import { getCurrentEvent } from "utils/time";
import Chatbox from "components/organisms/Chatbox";
import RoomModalOngoingEvent from "components/templates/PartyMap/components/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import ScheduleItem from "components/templates/PartyMap/components/ScheduleItem";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { updateTheme } from "pages/VenuePage/helpers";
import "./RoomPage.scss";
import { User } from "types/User";
import { User as FUser } from "firebase";
import { PartyMapVenue } from "types/PartyMapVenue";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";

export default function RoomPage() {
  const { roomPath } = useParams(); //@debt typing - we should type this hook

  const { user } = useUser();
  const { users, venue } = useSelector((state) => ({
    venue: state.firestore.ordered.currentVenue?.[0],
    users: state.firestore.ordered.partygoers,
  })) as { users: User[]; user: FUser; venue: PartyMapVenue };

  if (!venue || !user) {
    return null;
  }

  const room = venue.rooms.find((r) => r.url === `/${roomPath}`);

  if (!room) {
    return null;
  }

  venue && updateTheme(venue);

  const usersToDisplay =
    users?.filter((user) => user.room === room?.title) ?? [];

  function enter() {
    room && user && enterRoom(user, room.title);
  }

  const currentEvent =
    room.events && getCurrentEvent(room, venue.start_utc_seconds);

  return (
    <WithNavigationBar redirectionUrl={`/v/${venue.id}`}>
      <div className="container room-container">
        <div className="room-description">
          <div className="title-container">
            <h2 className="room-modal-title">{room.title}</h2>
            <div className="room-modal-subtitle">{room.subtitle}</div>
            <div className="row ongoing-event-row">
              <div className="col">
                <img
                  src={`/room-images/${room.image}`}
                  className="room-page-image"
                  alt={room.title}
                />
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
        <UserList users={usersToDisplay} limit={11} activity={"in this room"} />
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
          <div className="col-5 chatbox-container">
            <Chatbox room={room.title} />
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
}
