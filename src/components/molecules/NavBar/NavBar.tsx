import React, { useCallback, useMemo, useRef, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase/app";

import { DISABLED_DUE_TO_1142, SPARKLE_PHOTOBOOTH_URL } from "settings";

import { UpcomingEvent } from "types/UpcomingEvent";

import { shouldScheduleBeShown } from "utils/schedule";
import { enterSpace } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { useAdminContextCheck } from "hooks/useAdminContextCheck";
import { useOwnedVenues } from "hooks/useConnectOwnedVenues";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRadio } from "hooks/useRadio";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";
import { useWorldById } from "hooks/worlds/useWorldById";

import { NavBarSchedule } from "components/organisms/NavBarSchedule/NavBarSchedule";

import { NormalRadio } from "components/molecules/NavBar/components/NormalRadio";
import { NavSearchBar } from "components/molecules/NavSearchBar";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { VenuePartygoers } from "components/molecules/VenuePartygoers";

import { BackButton } from "components/atoms/BackButton";
import { UserAvatar } from "components/atoms/UserAvatar";

import { NavBarLogin } from "./components/NavBarLogin";
import { SoundCloudRadio } from "./components/SoundCloudRadio";

import "./NavBar.scss";
import "./playa.scss";

const TicketsPopover: React.FC<{ futureUpcoming: UpcomingEvent[] }> = (
  props: unknown,
  { futureUpcoming }
) => (
  <Popover id="popover-basic" {...props}>
    <Popover.Content>
      <UpcomingTickets events={futureUpcoming} />
    </Popover.Content>
  </Popover>
);

const navBarScheduleClassName = "NavBar__schedule-dropdown";

export interface NavBarPropsType {
  hasBackButton?: boolean;
  withSchedule?: boolean;
  withPhotobooth?: boolean;
  withHiddenLoginButton?: boolean;
  withRadio?: boolean;
  title?: string;
}

export const NavBar: React.FC<NavBarPropsType> = ({
  hasBackButton,
  withSchedule,
  withPhotobooth,
  withRadio,
  title,
  withHiddenLoginButton,
}) => {
  const { user, userWithId } = useUser();
  const isAdminContext = useAdminContextCheck();
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  const {
    currentVenue: relatedVenue,
    parentVenue,
    sovereignVenueId,
  } = useRelatedVenues({
    currentVenueId: spaceId,
  });

  const { world } = useWorldById(relatedVenue?.worldId);
  const firstStation = world?.radioStations?.[0];

  const { currentVenue: ownedVenue } = useOwnedVenues({
    currentVenueId: spaceId,
  });

  // when Admin is displayed, owned venues are used
  const currentVenue = relatedVenue ?? ownedVenue;

  const { push: openUrlUsingRouter } = useHistory();

  const { openUserProfileModal } = useProfileModalControls();

  const handleAvatarClick = useCallback(() => {
    openUserProfileModal(userWithId?.id);
  }, [openUserProfileModal, userWithId]);

  const shouldShowSchedule =
    !isAdminContext && withSchedule && shouldScheduleBeShown(world);

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming =
    currentVenue?.events?.filter((e) => e.ts_utc.valueOf() > now.valueOf()) ??
    []; //@debt typing does this exist?

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

  const isSoundCloud = firstStation?.includes("soundcloud");

  const sound = useMemo(
    () => (firstStation && !isSoundCloud ? new Audio(firstStation) : undefined),
    [isSoundCloud, firstStation]
  );

  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const { volume, setVolume } = useRadio(isRadioPlaying, sound);

  const radioFirstPlayStateLoaded = useRef(false);
  const showRadioOverlay = useMemo(() => {
    if (!radioFirstPlayStateLoaded.current) {
      const radioFirstPlayStorageKey = "radioFirstPlay";
      const radioFirstPlayState = localStorage.getItem(
        radioFirstPlayStorageKey
      );
      if (!radioFirstPlayState) {
        localStorage.setItem(radioFirstPlayStorageKey, JSON.stringify(true));
        return true;
      }
      radioFirstPlayStateLoaded.current = true;
    }
    return false;
  }, [radioFirstPlayStateLoaded]);

  const [isEventScheduleVisible, setEventScheduleVisible] = useState(false);
  const toggleEventSchedule = useCallback(() => {
    setEventScheduleVisible(!isEventScheduleVisible);
  }, [isEventScheduleVisible]);
  const hideEventSchedule = useCallback((e) => {
    if (
      e.target.closest(`.${navBarScheduleClassName}`) ||
      e.target.closest(`.modal`)
    )
      return;

    setEventScheduleVisible(false);
  }, []);

  const navigateToHomepage = useCallback(() => {
    if (!relatedVenue) return;

    enterSpace(worldSlug, relatedVenue.slug, {
      customOpenRelativeUrl: openUrlUsingRouter,
    });
  }, [worldSlug, relatedVenue, openUrlUsingRouter]);

  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  const handlePhotoboothRedirect = () => {
    openUrlUsingRouter(SPARKLE_PHOTOBOOTH_URL);
  };

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = title || (parentVenue?.name ?? currentVenue?.name);
  const showNormalRadio = withRadio
    ? (world?.showRadio && !isSoundCloud) ?? false
    : false;
  const showSoundCloudRadio = withRadio
    ? (world?.showRadio && isSoundCloud) ?? false
    : false;
  console.log(isAdminContext);
  return (
    <>
      <header>
        <div className="navbar navbar_playa nonplaya">
          <div className="navbar-container">
            <div className="nav-logos">
              <div className="nav-sparkle-logo">
                <div />
              </div>
              <div
                className="nav-sparkle-logo_small"
                onClick={navigateToHomepage}
              >
                <div />
              </div>

              {shouldShowSchedule && spaceId ? (
                <button
                  aria-label="Schedule"
                  className={`nav-party-logo ${
                    isEventScheduleVisible && "clicked"
                  }`}
                  onClick={toggleEventSchedule}
                >
                  {spaceId && !isAdminContext && navbarTitle} &nbsp;
                  <span className="schedule-text">Schedule</span>
                </button>
              ) : (
                <>
                  <div className="nav-location-title">Sparkle Admin</div>
                  <div>{navbarTitle}</div>
                </>
              )}

              {spaceId && !isAdminContext && (
                <VenuePartygoers worldId={currentVenue?.worldId} />
              )}
            </div>

            {!DISABLED_DUE_TO_1142 && withPhotobooth && (
              <div
                className="NavBar__photobooth-button nav-schedule"
                onClick={handlePhotoboothRedirect}
              >
                <p className="NavBar__photobooth-title">Photobooth</p>
              </div>
            )}

            {!withHiddenLoginButton && !user && <NavBarLogin />}

            {user && (
              <div className="navbar-links">
                {sovereignVenueId && !isAdminContext && (
                  <NavSearchBar sovereignVenueId={sovereignVenueId} />
                )}

                {hasUpcomingEvents && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={<TicketsPopover futureUpcoming={futureUpcoming} />}
                    rootClose={true}
                  >
                    <span className="tickets-icon">
                      <FontAwesomeIcon icon={faTicketAlt} />
                    </span>
                  </OverlayTrigger>
                )}

                {showNormalRadio && (
                  <NormalRadio
                    volume={volume}
                    setVolume={setVolume}
                    title={currentVenue?.radioTitle}
                    onEnableHandler={handleRadioEnable}
                    radioPlaying={isRadioPlaying}
                    defaultShow={showRadioOverlay}
                  />
                )}

                {showSoundCloudRadio && (
                  <SoundCloudRadio volume={volume} station={firstStation} />
                )}
                <div
                  className="navbar-links-user-avatar"
                  onClick={handleAvatarClick}
                >
                  <UserAvatar user={userWithId} showStatus size="medium" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {shouldShowSchedule && spaceId && (
        <div
          aria-hidden={isEventScheduleVisible ? "false" : "true"}
          className={`schedule-dropdown-backdrop ${
            isEventScheduleVisible ? "show" : ""
          }`}
          onClick={hideEventSchedule}
        >
          <div className={navBarScheduleClassName}>
            <NavBarSchedule
              isVisible={isEventScheduleVisible}
              venueId={spaceId}
            />
          </div>
        </div>
      )}

      {/* @debt Remove back button from Navbar */}
      {hasBackButton && currentVenue?.parentId && parentVenue?.name && (
        <BackButton variant="relative" space={parentVenue} />
      )}
    </>
  );
};
