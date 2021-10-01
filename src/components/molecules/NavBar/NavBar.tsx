import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  faCog,
  faEye,
  faHome,
  faInfoCircle,
  faSearch,
  faTicketAlt,
  faUser,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import firebase from "firebase/app";
import { isEmpty } from "lodash";

import {
  DEFAULT_SHOW_SCHEDULE,
  PLAYA_VENUE_ID,
  SPARKLE_PHOTOBOOTH_URL,
} from "settings";

import { UpcomingEvent } from "types/UpcomingEvent";

import { radioStationsSelector } from "utils/selectors";
import { enterVenue, getExtraLinkProps, venueInsideUrl } from "utils/url";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRadio } from "hooks/useRadio";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { NavBarSchedule } from "components/organisms/NavBarSchedule/NavBarSchedule";
import { RadioModal } from "components/organisms/RadioModal/RadioModal";

import { NavSearchBar } from "components/molecules/NavSearchBar";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { VenuePartygoers } from "components/molecules/VenuePartygoers";

import { BackButton } from "components/atoms/BackButton";
import { ButtonNG } from "components/atoms/ButtonNG";
import { UserAvatar } from "components/atoms/UserAvatar";

import * as S from "./Navbar.styles";
import { NavBarLogin } from "./NavBarLogin";

import radio from "assets/icons/radio.svg";

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
}

export const NavBar: React.FC<NavBarPropsType> = ({
  hasBackButton,
  withSchedule,
  withPhotobooth,
}) => {
  const { profile, user, userWithId } = useUser();
  const venueId = useVenueId();
  const radioStations = useSelector(radioStationsSelector);

  const { currentVenue, parentVenue, sovereignVenueId } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const {
    location: { pathname },
    push: openUrlUsingRouter,
  } = useHistory();

  const { isShown: isDropdownShown, toggle: toggleDropdownShown } = useShowHide(
    false
  );
  const { isShown: isSearchShown, toggle: toggleSearchShown } = useShowHide();

  const [isSearchInFocus, setIsSearchInFocus] = useState(false);

  const isSovereignVenue = venueId === sovereignVenueId;

  const hasSovereignVenue = sovereignVenueId !== undefined;

  const shouldShowHomeButton = hasSovereignVenue && !isSovereignVenue;

  const { openUserProfileModal } = useProfileModalControls();

  const handleAvatarClick = useCallback(() => {
    openUserProfileModal(userWithId?.id);
  }, [openUserProfileModal, userWithId]);

  const shouldShowSchedule =
    withSchedule && (currentVenue?.showSchedule ?? DEFAULT_SHOW_SCHEDULE);

  const isOnPlaya = pathname.toLowerCase() === venueInsideUrl(PLAYA_VENUE_ID);

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming =
    currentVenue?.events?.filter((e) => e.ts_utc.valueOf() > now.valueOf()) ??
    []; //@debt typing does this exist?

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

  const hasRadioStations = useCallback(
    (arr: string[] | undefined): arr is string[] => !isEmpty(arr),
    []
  );

  const isSoundCloud =
    hasRadioStations(radioStations) &&
    RegExp("soundcloud").test(radioStations[0]);

  const sound = useMemo(
    () =>
      radioStations && hasRadioStations(radioStations) && !isSoundCloud
        ? new Audio(radioStations[0])
        : undefined,
    [hasRadioStations, isSoundCloud, radioStations]
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

  const parentVenueId = parentVenue?.id;

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [parentVenueId, openUrlUsingRouter]);

  const navigateToHomepage = useCallback(() => {
    if (!sovereignVenueId) return;

    enterVenue(sovereignVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [sovereignVenueId, openUrlUsingRouter]);

  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  const onInputFocus = useCallback(() => setIsSearchInFocus(true), []);

  const onInputBlur = useCallback(() => {
    setIsSearchInFocus(false);
    toggleSearchShown();
  }, [toggleSearchShown]);

  const onMouseLeave = useCallback(() => {
    if (isSearchInFocus) return;

    toggleSearchShown();
  }, [isSearchInFocus, toggleSearchShown]);

  const [showRadioPopover, setShowRadioPopover] = useState(false);

  const toggleShowRadioPopover = useCallback(
    () => setShowRadioPopover((prevState) => !prevState),
    []
  );

  const handlePhotoboothRedirect = () => {
    openUrlUsingRouter(SPARKLE_PHOTOBOOTH_URL);
  };

  if (!venueId || !currentVenue) return null;

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? currentVenue.name;

  const radioStation = hasRadioStations(radioStations) && radioStations[0];

  const showNormalRadio = (currentVenue?.showRadio && !isSoundCloud) ?? false;
  const showSoundCloudRadio =
    (currentVenue?.showRadio && isSoundCloud) ?? false;

  const dropdownArrowClasses = classNames({
    "navbar__dropdown-arrow-up": isDropdownShown,
    "navbar__dropdown-arrow-down": !isDropdownShown,
  });

  return (
    <>
      <header>
        <div className={`navbar navbar_playa ${!isOnPlaya && "nonplaya"}`}>
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
              {shouldShowHomeButton && (
                <FontAwesomeIcon
                  icon={faHome}
                  className="NavBar__home-icon"
                  onClick={navigateToHomepage}
                />
              )}

              {shouldShowSchedule ? (
                <button
                  aria-label="Schedule"
                  className={`nav-party-logo ${
                    isEventScheduleVisible && "clicked"
                  }`}
                  onClick={toggleEventSchedule}
                >
                  <p className="nav-party-logo-text">{navbarTitle}</p>
                  <span className="schedule-text">{"What’s On"}</span>
                </button>
              ) : (
                <div>{navbarTitle}</div>
              )}
              <div className="navbar-links__simple-view">
                <a
                  className="navbar-links__simple-view-a"
                  href={`/m/${venueId}`}
                  {...getExtraLinkProps(true)}
                >
                  <ButtonNG className="navbar-links__simple-view-button">
                    <FontAwesomeIcon icon={faEye} />
                    <span className="navbar-links__simple-view-text">
                      Simple View
                    </span>
                  </ButtonNG>
                </a>
              </div>
            </div>

            {withPhotobooth && (
              <div
                className="NavBar__photobooth-button nav-schedule"
                onClick={handlePhotoboothRedirect}
              >
                <p className="NavBar__photobooth-title">Photobooth</p>
              </div>
            )}

            {!user && <NavBarLogin />}

            {user && (
              <div className="navbar-links">
                <VenuePartygoers />

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

                <div
                  className="navbar-links__search"
                  onMouseEnter={toggleSearchShown}
                  onMouseLeave={onMouseLeave}
                >
                  {isSearchShown && (
                    <NavSearchBar
                      venueId={venueId ?? ""}
                      onFocus={onInputFocus}
                      onBlur={onInputBlur}
                    />
                  )}
                  <ButtonNG
                    className="navbar-links__menu-link"
                    iconOnly
                    iconSize="1x"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </ButtonNG>
                </div>
                <ButtonNG
                  className="navbar-links__menu-link"
                  iconOnly
                  iconSize="1x"
                >
                  <img src={radio} alt="radio" />
                </ButtonNG>
                <ButtonNG
                  className="navbar-links__menu-link"
                  iconOnly
                  iconSize="1x"
                >
                  <FontAwesomeIcon icon={faVolumeUp} />
                </ButtonNG>

                {showNormalRadio && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={
                      <Popover id="radio-popover">
                        <Popover.Content>
                          <RadioModal
                            {...{
                              volume,
                              setVolume,
                              title: currentVenue?.radioTitle,
                            }}
                            onEnableHandler={handleRadioEnable}
                            isRadioPlaying={isRadioPlaying}
                          />
                        </Popover.Content>
                      </Popover>
                    }
                    rootClose={true}
                    defaultShow={showRadioOverlay}
                  >
                    <button
                      className={`profile-icon navbar-link-radio ${
                        volume === 0 && "off"
                      }`}
                    />
                  </OverlayTrigger>
                )}

                {showSoundCloudRadio && (
                  <S.RadioTrigger>
                    <button
                      className={`profile-icon navbar-link-radio ${
                        volume === 0 && "off"
                      }`}
                      onClick={toggleShowRadioPopover}
                    />

                    <S.RadioWrapper showRadioPopover={showRadioPopover}>
                      <iframe
                        title="venueRadio"
                        id="sound-cloud-player"
                        scrolling="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${radioStation}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`}
                      />
                    </S.RadioWrapper>
                  </S.RadioTrigger>
                )}
                <div
                  className="navbar-links-user-avatar"
                  onClick={toggleDropdownShown}
                >
                  <UserAvatar user={userWithId} showStatus size="medium" />
                  <div className={dropdownArrowClasses}></div>
                </div>
                {isDropdownShown && (
                  <Dropdown className="navbar__dropdown">
                    <Dropdown.Item className="navbar__dropdown-item" disabled>
                      {profile?.partyName && (
                        <span>Hello {profile.partyName}</span>
                      )}
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="navbar__dropdown-item"
                      onClick={handleAvatarClick}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="navbar__dropdown-item-icon"
                      />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item className="navbar__dropdown-item">
                      <FontAwesomeIcon
                        icon={faCog}
                        className="navbar__dropdown-item-icon"
                      />
                      Account
                    </Dropdown.Item>
                    <Dropdown.Item className="navbar__dropdown-item">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="navbar__dropdown-item-icon"
                      />
                      Help
                    </Dropdown.Item>
                  </Dropdown>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {shouldShowSchedule && (
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
              venueId={venueId}
            />
          </div>
        </div>
      )}

      {/* @debt Remove back button from Navbar */}
      {hasBackButton && currentVenue?.parentId && parentVenue?.name && (
        <BackButton
          onClick={backToParentVenue}
          locationName={parentVenue.name}
        />
      )}
    </>
  );
};
