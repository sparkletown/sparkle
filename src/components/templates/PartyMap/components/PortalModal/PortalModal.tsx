import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";

import { ALWAYS_EMPTY_ARRAY, ROOM_TAXON } from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room, RoomType } from "types/rooms";
import { AnyVenue, VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useAnalytics } from "hooks/useAnalytics";
import { useDispatch } from "hooks/useDispatch";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useRoom } from "hooks/useRoom";
import { useWorldById } from "hooks/worlds/useWorldById";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";
import VideoModal from "components/organisms/VideoModal";

import { UserList } from "components/molecules/UserList";

import { ScheduleItem } from "..";

import "./PortalModal.scss";

const emptyEvents: WithVenueId<WithId<VenueEvent>>[] = [];

export interface PortalModalProps {
  onHide: () => void;
  show: boolean;
  venue?: WithId<AnyVenue>;
  room?: Room;
  venueEvents?: WithVenueId<WithId<VenueEvent>>[];
}

export const PortalModal: React.FC<PortalModalProps> = ({
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
    <Modal show={show} onHide={onHide} className="PortalModal" centered>
      <Modal.Body className="PortalModal__modal-body">
        <PortalModalContent
          room={room}
          venueEvents={venueEvents}
          venue={venue}
        />
      </Modal.Body>
    </Modal>
  );
};

export interface PortalModalContentProps {
  room: Room;
  venue: WithId<AnyVenue>;
  venueEvents: WithVenueId<WithId<VenueEvent>>[];
}

export const PortalModalContent: React.FC<PortalModalContentProps> = ({
  room,
  venue,
  venueEvents,
}) => {
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

  const { world } = useWorldById(venue?.worldId);

  const { enterRoom, portalVenueId } = useRoom({
    room,
  });

  const analytics = useAnalytics({ venue });

  const portalVenue = findVenueInRelatedVenues(portalVenueId);

  const portalVenueSubtitle = portalVenue?.config?.landingPageConfig?.subtitle;
  const portalVenueDescription =
    portalVenue?.config?.landingPageConfig?.description;

  const [enterWithSound] = useCustomSound(room.enterSound, {
    interrupt: true,
    onend: enterRoom,
  });

  // note: this is here just to change the type on it in an easy way
  const enter: () => void = useCallback(() => {
    analytics.trackEnterRoomEvent(room.title, room.template);
    void (isExternalPortal(room) ? openUrl(room.url) : enterWithSound());
  }, [analytics, enterWithSound, room]);

  const renderedRoomEvents = useMemo(() => {
    if (!world?.showSchedule) return [];

    return venueEvents.map((event, index: number) => (
      <ScheduleItem
        // @debt Ideally event.id would always be a unique identifier, but our types suggest it
        //   can be undefined. Because we can't use index as a key by itself (as that is unstable
        //   and causes rendering issues, we construct a key that, while not guaranteed to be unique,
        //   is far less likely to clash
        key={event.id ?? `${event.room}-${event.name}-${index}`}
        event={event}
        enterEventLocation={enter}
      />
    ));
  }, [enter, venueEvents, world?.showSchedule]);

  const showRoomEvents = world?.showSchedule && renderedRoomEvents.length > 0;

  const iconStyles = {
    backgroundImage: room.image_url ? `url(${room.image_url})` : undefined,
  };

  const roomTitle = room.title || portalVenue?.name;
  const roomSubtitle = room.subtitle || portalVenueSubtitle;
  const roomDescription = room.about || portalVenueDescription;

  useEffect(() => {
    analytics.trackOpenPortalModalEvent(roomTitle);
  }, [analytics, roomTitle]);

  // @debt maybe refactor this, but autoFocus property working very bad.
  const enterButtonref = useRef<HTMLButtonElement>(null);
  useEffect(() => enterButtonref.current?.focus());

  return (
    <>
      <div className="PortalModal__main">
        <div className="PortalModal__icon" style={iconStyles} />

        <div className="PortalModal__content">
          <div className="PortalModal__title">{roomTitle}</div>

          {roomSubtitle && (
            <div className="PortalModal__subtitle">{roomSubtitle}</div>
          )}

          {/* @debt extract this 'enter room' button/link concept into a reusable component */}
          {/* @debt convert this to an <a> tag once blockers RE: counting/user presence are solved, see https://github.com/sparkletown/sparkle/issues/1670 */}
          <button
            ref={enterButtonref}
            autoFocus
            className="btn btn-primary PortalModal__btn-enter"
            onMouseOver={triggerAttendance}
            onMouseOut={clearAttendance}
            onClick={enter}
          >
            Enter
          </button>
        </div>
      </div>

      {room.about && (
        <div className="PortalModal__description">
          <RenderMarkdown text={roomDescription} />
        </div>
      )}

      <UserList
        containerClassName="PortalModal__userlist"
        usersSample={portalVenue?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
        userCount={portalVenue?.recentUserCount ?? 0}
        activity={`in this ${ROOM_TAXON.lower}`}
      />

      {showRoomEvents && (
        <div className="PortalModal__events">{renderedRoomEvents}</div>
      )}
    </>
  );
};
