import React, { useCallback, useEffect, useRef } from "react";
import ShowMoreText from "react-show-more-text";

import { ALWAYS_EMPTY_ARRAY, SPACE_TAXON } from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room } from "types/rooms";
import { WorldEvent } from "types/venues";

import { shouldScheduleBeShown } from "utils/schedule";
import { isExternalPortal, openUrl } from "utils/url";

import { useCustomSound } from "hooks/sounds";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useAnalytics } from "hooks/useAnalytics";
import { useDispatch } from "hooks/useDispatch";
import { usePortal } from "hooks/usePortal";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import { UserList } from "components/molecules/UserList";

import { ButtonNG } from "components/atoms/ButtonNG";

import { PortalSchedule } from "../PortalSchedule";

import "./PortalModal.scss";

interface PortalModalContentProps {
  portal: Room;
  venueEvents: WorldEvent[];
  onHide: () => void;
}

export const PortalModalContent: React.FC<PortalModalContentProps> = ({
  portal,
  venueEvents,
  onHide,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { world, space, spaceId } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

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
    currentVenueId: spaceId,
  });

  const { enterPortal, portalSpaceId } = usePortal({
    portal,
  });

  const analytics = useAnalytics({ venue: space });

  const portalSpace = findVenueInRelatedVenues({ spaceId: portalSpaceId });

  const portalVenueSubtitle = portalSpace?.config?.landingPageConfig?.subtitle;
  const portalVenueDescription =
    portalSpace?.config?.landingPageConfig?.description;

  const [enterWithSound] = useCustomSound(portal.enterSound, {
    interrupt: true,
    onend: enterPortal,
  });

  // note: this is here just to change the type on it in an easy way
  const enter: () => void = useCallback(() => {
    analytics.trackEnterRoomEvent(portal.title, portal.template);
    void (isExternalPortal(portal) ? openUrl(portal.url) : enterWithSound());
    onHide();
  }, [analytics, enterWithSound, onHide, portal]);

  const showPortalEvents =
    shouldScheduleBeShown(world) && venueEvents.length > 0;

  const iconStyles = {
    backgroundImage: portal.image_url ? `url(${portal.image_url})` : undefined,
  };

  const portalTitle = portal.title || portalSpace?.name;
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
            usersSample={portalSpace?.recentUsersSample ?? ALWAYS_EMPTY_ARRAY}
            userCount={portalSpace?.recentUserCount ?? 0}
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
        {/* @debt convert this to an <a> tag once blockers RE: counting/user presence are solved, @see https://github.com/sparkletown/sparkle/issues/1670 */}
        <ButtonNG
          forwardRef={enterButtonref}
          autoFocus
          className="PortalModal__btn-enter"
          onMouseOver={triggerAttendance}
          onMouseOut={clearAttendance}
          onClick={enter}
          variant="primary"
        >
          Enter
        </ButtonNG>
      </div>

      {showPortalEvents && <PortalSchedule portalEvents={venueEvents} />}
    </>
  );
};
