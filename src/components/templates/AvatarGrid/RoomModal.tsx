import React from "react";

// Components
import { Modal } from "react-bootstrap";
import UserProfilePicture from "components/molecules/UserProfilePicture";

// Hooks
import { useDispatch } from "hooks/useDispatch";
import {
  currentVenueEventsNGLegacyWorkaroundSelector,
  currentVenueNGLegacyWorkaroundSelector,
} from "hooks/useConnectCurrentVenueNG";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

// Utils | Settings | Constants
import { isEventLive } from "utils/event";
import {
  currentTimeInUnixEpoch,
  formatUtcSeconds,
  getCurrentTimeInUTCSeconds,
  ONE_MINUTE_IN_SECONDS,
} from "utils/time";
import { enterRoom } from "utils/useLocationUpdateEffect";
import { partygoersSelector } from "utils/selectors";

// Typings
import { AvatarGridRoom } from "types/AvatarGrid";

// Reducer | Actions
import { retainAttendance } from "store/actions/Attendance";

// Styles
import "./RoomModal.scss";
import "./AvatarGrid.scss";

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
  const { user, profile } = useUser();

  const partygoers = useSelector(partygoersSelector);
  const venueEvents = useSelector(currentVenueEventsNGLegacyWorkaroundSelector);
  const venue = useSelector(currentVenueNGLegacyWorkaroundSelector);

  const dispatch = useDispatch();

  if (!room) {
    return <></>;
  }

  const venueName = venue.name;

  const enter = () => {
    room &&
      user &&
      enterRoom(
        user,
        { [`${venueName}/${room.title}`]: currentTimeInUnixEpoch },
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
          getCurrentTimeInUTCSeconds()
    );

  const usersInRoom = partygoers.filter(
    (goer) => goer.room === `${venueName}/${room.title}`
  );

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
                    avatarClassName={"profile-avatar"}
                    setSelectedUserProfile={() => {}}
                    miniAvatars={miniAvatars}
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
              onMouseOver={() => dispatch(retainAttendance(true))}
              onMouseOut={() => dispatch(retainAttendance(false))}
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
