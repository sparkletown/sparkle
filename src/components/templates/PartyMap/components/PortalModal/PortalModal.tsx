import React, { useCallback, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import ShowMoreText from "react-show-more-text";

import { ALWAYS_EMPTY_ARRAY, SPACE_TAXON } from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room, RoomType } from "types/rooms";
import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";
import { shouldScheduleBeShown } from "utils/schedule";
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

import { PortalSchedule } from "../PortalSchedule";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./PortalModal.scss";

const emptyEvents: WithId<WorldEvent>[] = [];

export interface PortalModalProps {
  onHide: () => void;
  show: boolean;
  venue?: WithId<AnyVenue>;
  portal?: Room;
  venueEvents?: WithId<WorldEvent>[];
}

export const PortalModal: React.FC<PortalModalProps> = ({
  onHide,
  portal,
  show,
  venue,
  venueEvents = emptyEvents,
}) => {
  if (!venue || !portal) return null;

  if (portal.type === RoomType.modalFrame) {
    return (
      <VideoModal
        show={show}
        onHide={onHide}
        caption={portal.title}
        url={portal.url}
        autoplay
        backdrop
      />
    );
  }

  return (
    <Modal show={show} onHide={onHide} className="PortalModal" centered>
      <Modal.Body className="PortalModal__modal-body">
        <PortalModalContent
          portal={portal}
          venueEvents={venueEvents}
          venue={venue}
        />

        <img
          className="PortalModal__close-icon"
          src={PortalCloseIcon}
          alt="close portal"
          onClick={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export interface PortalModalContentProps {
  portal: Room;
  venue: WithId<AnyVenue>;
  venueEvents: WithId<WorldEvent>[];
}

export const PortalModalContent: React.FC<PortalModalContentProps> = ({
  portal,
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

  const { enterRoom, portalSpaceId } = useRoom({
    room: portal,
  });

  const analytics = useAnalytics({ venue });

  const portalVenue = findVenueInRelatedVenues({ spaceId: portalSpaceId });

  const portalVenueSubtitle = portalVenue?.config?.landingPageConfig?.subtitle;
  const portalVenueDescription =
    portalVenue?.config?.landingPageConfig?.description;

  const [enterWithSound] = useCustomSound(portal.enterSound, {
    interrupt: true,
    onend: enterRoom,
  });

  // note: this is here just to change the type on it in an easy way
  const enter: () => void = useCallback(() => {
    analytics.trackEnterRoomEvent(portal.title, portal.template);
    void (isExternalPortal(portal) ? openUrl(portal.url) : enterWithSound());
  }, [analytics, enterWithSound, portal]);

  const showPortalEvents =
    shouldScheduleBeShown(world) && venueEvents.length > 0;

  const iconStyles = {
    backgroundImage: portal.image_url ? `url(${portal.image_url})` : undefined,
  };

  const portalTitle = portal.title || portalVenue?.name;
  const portalSubtitle = portal.subtitle || portalVenueSubtitle;
  const portalDescription = portal.about || portalVenueDescription;

  useEffect(() => {
    analytics.trackOpenPortalModalEvent(portalTitle);
  }, [analytics, portalTitle]);

  // @debt maybe refactor this, but autoFocus property working very bad.
  const enterButtonref = useRef<HTMLButtonElement>(null);
  useEffect(() => enterButtonref.current?.focus());

  return (
    <>
      <div className="PortalModal__main">
        <div className="PortalModal__icon" style={iconStyles} />

        <div className="PortalModal__content">
          <div className="PortalModal__title">{portalTitle}</div>

          {portalSubtitle && (
            <ShowMoreText
              lines={2}
              more="Show more"
              less="Show less"
              className="PortalModal__subtitle"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {portalSubtitle}
            </ShowMoreText>
          )}

          <UserList
            containerClassName="PortalModal__userlist"
            usersSample={portalVenue?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            userCount={portalVenue?.recentUserCount ?? 0}
            activity={`in this ${SPACE_TAXON.lower}`}
            attendeesTitle={world?.attendeesTitle}
          />
        </div>
      </div>

      {portalDescription && (
        <ShowMoreText
          lines={3}
          more="Show more"
          less="Show less"
          className="PortalModal__description"
          expanded={false}
          truncatedEndingComponent={"... "}
        >
          <RenderMarkdown text={portalDescription} />
        </ShowMoreText>
      )}

      <div className="PortalModal__btn-wrapper">
        {/* @debt extract this 'enter portal' button/link concept into a reusable component */}
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

      {showPortalEvents && <PortalSchedule portalEvents={venueEvents} />}
    </>
  );
};
