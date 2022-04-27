import React, { useCallback, useEffect, useRef } from "react";
import ShowMoreText from "react-show-more-text";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFAULT_SHOW_MORE_SETTINGS,
  SPACE_TAXON,
} from "settings";

import { retainAttendance } from "store/actions/Attendance";

import { Room } from "types/rooms";
import { WorldEvent } from "types/venues";

import { shouldScheduleBeShown } from "utils/schedule";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
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
  const { world, space, spaceId } = useWorldAndSpaceByParams();

  const dispatch = useDispatch();

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const triggerAttendance = useCallback(() => {
    dispatch(retainAttendance(true));
  }, [dispatch]);

  // @debt do we need to keep this retainAttendance stuff (for counting feature), or is it legacy tech debt?
  const clearAttendance = useCallback(() => {
    dispatch(retainAttendance(false));
  }, [dispatch]);

  const { worldSpacesById } = useRelatedVenues({
    currentVenueId: spaceId,
  });

  const { enterPortal, portalSpaceId } = usePortal({
    portal,
  });

  const analytics = useAnalytics({ venue: space });

  const portalSpace = portalSpaceId && worldSpacesById[portalSpaceId];

  const portalVenueSubtitle = portalSpace?.config?.landingPageConfig?.subtitle;
  const portalVenueDescription =
    portalSpace?.config?.landingPageConfig?.description;

  // note: this is here just to change the type on it in an easy way
  const enter: () => void = useCallback(() => {
    analytics.trackEnterRoomEvent(portal.title, portal.template);
    void enterPortal();
    onHide();
  }, [analytics, enterPortal, onHide, portal]);

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
              className="PortalModal__subtitle"
              {...DEFAULT_SHOW_MORE_SETTINGS}
            >
              {portalSubtitle}
            </ShowMoreText>
          )}

          <UserList
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
          className="PortalModal__description"
          {...DEFAULT_SHOW_MORE_SETTINGS}
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
