import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_SHOW_SCHEDULE,
  ROOM_TAXON,
} from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room, RoomType } from "types/rooms";
import { AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { trackAnalyticEvent } from "utils/mixpanel";

import { useCustomSound } from "hooks/sounds";
import { useDispatch } from "hooks/useDispatch";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";
import { useUser } from "hooks/useUser";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import VideoModal from "components/organisms/VideoModal";

import { UserList } from "components/molecules/UserList";

import { ScheduleItem } from "..";

import "./RoomModal.scss";

const emptyEvents: WithVenueId<WithId<VenueEvent>>[] = [];

export interface RoomModalProps {
  onHide: () => void;
  show: boolean;
  venue?: WithId<AnyVenue>;
  room?: Room;
  venueEvents?: WithVenueId<WithId<VenueEvent>>[];
}

export const RoomModal: React.FC<RoomModalProps> = ({
  onHide,
  room,
  show,
  venue,
  venueEvents = emptyEvents,
}) => {
  if (!venue || !room) return null;

  if (room.type === RoomType.modalFrame) {
    return (
      <VideoModal
        show={show}
        onHide={onHide}
        caption={room.title}
        url={room.url}
        autoplay
        backdrop
      />
    );
  }

  return (
    <Modal show={show} onHide={onHide} className="RoomModal" centered>
      <Modal.Body className="RoomModal__modal-body">
        <RoomModalContent room={room} venueEvents={venueEvents} venue={venue} />
      </Modal.Body>
    </Modal>
  );
};

export interface RoomModalContentProps {
  room: Room;
  venue: WithId<AnyVenue>;
  venueEvents: WithVenueId<WithId<VenueEvent>>[];
}

export const RoomModalContent: React.FC<RoomModalContentProps> = ({
  room,
  venue,
  venueEvents,
}) => {
  const { showSchedule = DEFAULT_SHOW_SCHEDULE } = venue;

  const dispatch = useDispatch();

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const triggerAttendance = useCallback(() => {
    dispatch(retainAttendance(true));
  }, [dispatch]);

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const clearAttendance = useCallback(() => {
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const { findVenueInRelatedVenues } = useRelatedVenues({
    currentVenueId: venue.id,
  });

  const { enterRoom, portalVenueId } = useRoom({
    room,
  });

  const { user } = useUser();

  const portalVenue = findVenueInRelatedVenues(portalVenueId);

  const portalVenueSubtitle = portalVenue?.config?.landingPageConfig?.subtitle;
  const portalVenueDescription =
    portalVenue?.config?.landingPageConfig?.description;

  const [_enterRoomWithSound] = useCustomSound(room.enterSound, {
    interrupt: true,
    onend: enterRoom,
  });

  // note: this is here just to change the type on it in an easy way
  const enterRoomWithSound: () => void = useCallback(() => {
    _enterRoomWithSound();
    trackAnalyticEvent("Enter room", {
      worldId: venue.worldId,
      email: user?.email,
      template: venue?.template,
    });
  }, [_enterRoomWithSound, user?.email, venue?.template, venue.worldId]);

  const renderedRoomEvents = useMemo(() => {
    if (!showSchedule) return [];

    return venueEvents.map((event, index: number) => (
      <ScheduleItem
        // @debt Ideally event.id would always be a unique identifier, but our types suggest it
        //   can be undefined. Because we can't use index as a key by itself (as that is unstable
        //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
        //   is far less likely to clash
        key={event.id ?? `${event.room}-${event.name}-${index}`}
        event={event}
        enterEventLocation={enterRoomWithSound}
      />
    ));
  }, [enterRoomWithSound, showSchedule, venueEvents]);

  const showRoomEvents = showSchedule && renderedRoomEvents.length > 0;

  const iconStyles = {
    backgroundImage: room.image_url ? `url(${room.image_url})` : undefined,
  };

  const roomTitle = room.title || portalVenue?.name;
  const roomSubtitle = room.subtitle || portalVenueSubtitle;
  const roomDescription = room.about || portalVenueDescription;

  useEffect(() => {
    trackAnalyticEvent("Open room modal", {
      worldId: venue.worldId,
      email: user?.email,
    });
  }, [user?.email, venue.worldId]);

  // @debt maybe refactor this, but autoFocus property working very bad.
  const enterButtonref = useRef<HTMLButtonElement>(null);
  useEffect(() => enterButtonref.current?.focus());

  return (
    <>
      <div className="RoomModal__main">
        <div className="RoomModal__icon" style={iconStyles} />

        <div className="RoomModal__content">
          <div className="RoomModal__title">{roomTitle}</div>

          {roomSubtitle && (
            <div className="RoomModal__subtitle">{roomSubtitle}</div>
          )}

          {/* @debt extract this 'enter room' button/link concept into a reusable component */}
          {/* @debt convert this to an <a> tag once blockers RE: counting/user presence are solved, see https://github.com/sparkletown/sparkle/issues/1670 */}
          <button
            ref={enterButtonref}
            autoFocus
            className="btn btn-primary RoomModal__btn-enter"
            onMouseOver={triggerAttendance}
            onMouseOut={clearAttendance}
            onClick={enterRoomWithSound}
          >
            Join {ROOM_TAXON.capital}
          </button>
        </div>
      </div>

      {room.about && (
        <div className="RoomModal__description">
          <RenderMarkdown text={roomDescription} />
        </div>
      )}

      <UserList
        containerClassName="RoomModal__userlist"
        usersSample={portalVenue?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
        userCount={portalVenue?.recentUserCount ?? 0}
        activity={`in this ${ROOM_TAXON.lower}`}
      />

      {showRoomEvents && (
        <div className="RoomModal__events">{renderedRoomEvents}</div>
      )}
    </>
  );
};
