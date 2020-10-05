import React from "react";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { Modal } from "react-bootstrap";
import { AvatarGridRoom } from "types/AvatarGrid";
import "./RoomModal.scss";
import "./AvatarGrid.scss";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import { useSelector } from "hooks/useSelector";
import {
  formatUtcSeconds,
  getCurrentTimeInUTCSeconds,
  ONE_MINUTE_IN_SECONDS,
} from "utils/time";
import { isEventLive } from "utils/event";

interface PropsType {
  show: boolean;
  onHide: () => void;
  miniAvatars: boolean | undefined;
  room: AvatarGridRoom | undefined;
}

const MAX_SHOWN_AVATARS = 5;

export const RoomModal: React.FC<PropsType> = ({
  show,
  onHide,
  room,
  miniAvatars,
}) => {
  const { user } = useUser();
  const { partygoers, venueEvents } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venueEvents: state.firestore.ordered.venueEvents,
  }));

  if (!room) {
    return <></>;
  }

  const enter = () => {
    room && user && enterRoom(user, room.title);
  };

  const roomEvents =
    venueEvents &&
    venueEvents.filter(
      (event) =>
        event.room === room.title &&
        event.start_utc_seconds +
          event.duration_minutes * ONE_MINUTE_IN_SECONDS >
          getCurrentTimeInUTCSeconds()
    );

  const usersInRoom = partygoers.filter((goer) => goer.room === room.title);

  return (
    <Modal show={show} onHide={onHide}>
      <div
        className="room-container"
        style={{ backgroundImage: `url(${room?.image_url})` }}
      >
        <h4 className="room-name">{room.title}</h4>
        <div className="room-description">{room.description}</div>
        <div className="room-people">
          {usersInRoom.map((user, index) => {
            return (
              index + 1 <= MAX_SHOWN_AVATARS && (
                <div key={index} className={"user"}>
                  <UserProfilePicture
                    user={user}
                    profileStyle={"profile-avatar"}
                    setSelectedUserProfile={() => {}}
                    miniAvatars={miniAvatars}
                    imageSize={undefined}
                  />
                </div>
              )
            );
          })}
          {usersInRoom.length > MAX_SHOWN_AVATARS && (
            <div className="user">
              +{usersInRoom.length - MAX_SHOWN_AVATARS}
            </div>
          )}
        </div>
        <div>
          {roomEvents && roomEvents.length > 0 && (
            <>
              <div className="schedule-title">Room Schedule</div>
              {roomEvents.map((event, idx: number) => {
                const isCurrentEvent = isEventLive(event);
                return (
                  <div key={idx} className="shedule-item-container">
                    <div
                      className={`time-section ${isCurrentEvent ? "live" : ""}`}
                    >
                      <div>
                        <b>{formatUtcSeconds(event.start_utc_seconds)}</b>
                      </div>
                      <div>
                        {formatUtcSeconds(
                          event.start_utc_seconds + event.duration_minutes * 60
                        )}
                      </div>
                    </div>
                    <div className="event-section">
                      <div>
                        <div className={`${isCurrentEvent ? "live" : ""}`}>
                          <div>
                            <b>{event.name}</b>
                          </div>
                          <div>
                            by <b>{event.host}</b>
                          </div>
                        </div>
                        <div className="event-description">
                          {event.description}
                        </div>
                      </div>
                      {isCurrentEvent && (
                        <div className="entry-room-button">
                          <a
                            className="btn btn-live"
                            id={`enter-room-from-schedule-event-${event}`}
                            href={room.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="room-button">
          {room.isFull ? (
            <button className="btn btn-disabled btn-block">
              Room is full - Come back later!
            </button>
          ) : (
            <a
              className="btn btn-active btn-block"
              href={room.url}
              rel={"noopener noreferrer"}
              target={"_blank"}
              onClick={enter}
            >
              Join the room
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
