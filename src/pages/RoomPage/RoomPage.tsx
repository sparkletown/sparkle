import React from "react";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { getCurrentEvent } from "utils/time";

import Chatbox from "components/organisms/Chatbox";
import RoomModalOngoingEvent from "components/molecules/RoomModalOngoingEvent";
import UserList from "components/molecules/UserList";
import ScheduleItem from "components/molecules/ScheduleItem";
import { PARTY_NAME } from "config";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import { enterRoom } from "utils/useLocationUpdateEffect";
import "./RoomPage.scss";

export default function RoomPage() {
  let { roomName } = useParams();

  const { config, user, users } = useSelector((state: any) => ({
    config: state.firestore.data.config?.[PARTY_NAME],
    user: state.user,
    users: state.firestore.ordered.partygoers,
  }));

  if (!config || !user) {
    return null;
  }

  const room = config.rooms.find((r: any) => r.url === `/${roomName}`);

  if (!room) {
    return null;
  }

  const usersToDisplay =
    users?.filter((user: any) => user.room === room?.title) ?? [];

  function enter() {
    enterRoom(user, room.title);
  }

  const currentEvent =
    room.events && getCurrentEvent(room, config.start_utc_seconds);

  return (
    <WithNavigationBar>
      <div className="container room-container">
        <div className="room-description">
          <div className="title-container">
            <h2 className="room-modal-title">{room.title}</h2>
            <div className="room-modal-subtitle">{room.subtitle}</div>
            <img
              src={`/room-images/${room.image}`}
              className="room-modal-image"
              alt={room.title}
            />
          </div>
          <RoomModalOngoingEvent
            room={room}
            enterRoom={enter}
            startUtcSeconds={config.start_utc_seconds}
          />
        </div>
        <UserList users={usersToDisplay} limit={11} activity={"in this room"} />
        {room.about && <div className="about-this-room">{room.about}</div>}
        <div className="row">
          {room.events && room.events.length > 0 && (
            <div className="col schedule-container">
              <div className="schedule-title">Room Schedule</div>
              {room.events.map((event: any, idx: number) => (
                <ScheduleItem
                  key={idx}
                  startUtcSeconds={config.start_utc_seconds}
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
