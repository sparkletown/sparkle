import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";
import {
  faCog,
  faEye,
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

import { IS_BURN } from "secrets";

import {
  ALLOW_NO_VENUE,
  BM_PARENT_ID,
  DEFAULT_AMBIENT_VOLUME,
  DEFAULT_SHOW_SCHEDULE,
  HELP_CENTER_URL,
  IS_SIMPLE_MUTE_BUTTON,
  LS_KEY_IS_AMBIENT_AUDIO_VOCAL,
  LS_KEY_RADIO_VOLUME,
  PLAYA_VENUE_ID,
  SPARKLEVERSE_PHOTOBOOTH_URL,
} from "settings";

import { setAnimateMapEnvironmentSound } from "store/actions/AnimateMap";

import { UpcomingEvent } from "types/UpcomingEvent";

import {
  animateMapEnvironmentSoundSelector,
  radioStationsSelector,
} from "utils/selectors";
import {
  enterVenue,
  getExtraLinkProps,
  openUrlInNewTab,
  venueInsideUrl,
} from "utils/url";

import { useAudioVolume } from "hooks/useAudioVolume";
import { useDispatch } from "hooks/useDispatch";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { GiftTicketModal } from "components/organisms/GiftTicketModal/GiftTicketModal";
import { NavBarSchedule } from "components/organisms/NavBarSchedule/NavBarSchedule";

import { NavSearchBar } from "components/molecules/NavSearchBar";
import { RadioPopoverContent } from "components/molecules/RadioPopoverContent";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { VenuePartygoers } from "components/molecules/VenuePartygoers";
import { VolumePopOverContent } from "components/molecules/VolumePopOverContent";

import { BackButton } from "components/atoms/BackButton";
import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";
import { UserAvatar } from "components/atoms/UserAvatar";
import { VolumeControl } from "components/atoms/VolumeControl";

import { NavBarLogin } from "./NavBarLogin";

import RadioIcon from "assets/icons/nav-link-radio.svg";

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

const GiftPopover = (
  <Popover id="gift-popover">
    <Popover.Content>
      <GiftTicketModal />
    </Popover.Content>
  </Popover>
);

const VolumePopover = (
  <Popover
    id="volume-popover"
    className="NavBar__volume-popover NavBar__volume-popover--without-sliders"
  >
    <Popover.Content>
      <VolumePopOverContent />
    </Popover.Content>
  </Popover>
);
export interface NavBarPropsType {
  hasBackButton?: boolean;
  withSchedule?: boolean;
  hasSchedule?: boolean;
}

export const NavBar: React.FC<NavBarPropsType> = ({
  hasBackButton = true,
  withSchedule = true,
  hasSchedule = true,
}) => {
  const { profile, user, userWithId } = useUser();
  const venueId = useVenueId();

  const radioStations = useSelector(radioStationsSelector);

  const { currentVenue, parentVenue } = useRelatedVenues({
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

  const [isFocus, setIsFocus] = useState(false);

  // Disabled caret back button on navBar
  // const isSovereignVenue = venueId === sovereignVenueId;
  // const hasSovereignVenue = sovereignVenueId !== undefined;
  // const shouldShowHomeButton = hasSovereignVenue && !isSovereignVenue;

  const {
    hasSelectedProfile,
    openUserProfileModal,
    updateUserProfileData,
    selectedUserProfile,
  } = useProfileModalControls();

  const isSameUser = useIsCurrentUser(selectedUserProfile);

  useEffect(() => {
    if (hasSelectedProfile && isSameUser) updateUserProfileData(userWithId);
  }, [hasSelectedProfile, isSameUser, updateUserProfileData, userWithId]);

  const handleAvatarClick = useCallback(() => {
    openUserProfileModal(userWithId);
  }, [openUserProfileModal, userWithId]);

  const shouldShowSchedule =
    withSchedule &&
    hasSchedule &&
    (currentVenue?.showSchedule ?? DEFAULT_SHOW_SCHEDULE);

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

  const parentVenueId = parentVenue?.id;

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [parentVenueId, openUrlUsingRouter]);

  const isSoundCloud =
    hasRadioStations(radioStations) &&
    RegExp("soundcloud").test(radioStations[0]);

  const radioAudio = useMemo(
    () =>
      radioStations && hasRadioStations(radioStations) && !isSoundCloud
        ? new Audio(radioStations[0])
        : undefined,
    [hasRadioStations, isSoundCloud, radioStations]
  );

  const [isRadioPlaying, setIsRadioPlaying] = useState(false);

  const { volume: radioVolume, setVolume: setRadioVolume } = useAudioVolume({
    audioElement: radioAudio,
    isAudioPlaying: isRadioPlaying,
    storageKey: LS_KEY_RADIO_VOLUME,
    initialVolume: DEFAULT_AMBIENT_VOLUME,
  });

  const dispatch = useDispatch();
  const isAmbientAudioVocal = useSelector(animateMapEnvironmentSoundSelector);
  const [, setAmbientAudioVocal] = useLocalStorage(
    LS_KEY_IS_AMBIENT_AUDIO_VOCAL
  );

  const onToggleAmbientAudio = useCallback(() => {
    const toggledValue = !isAmbientAudioVocal;
    setAmbientAudioVocal(toggledValue);
    dispatch(setAnimateMapEnvironmentSound(toggledValue));
  }, [dispatch, isAmbientAudioVocal, setAmbientAudioVocal]);

  const handleMute = useCallback(
    (volume: number) => (volume !== 0 ? 0 : 100),
    []
  );
  const toggleMute = useCallback(
    () => setRadioVolume(handleMute(radioVolume)),
    [handleMute, setRadioVolume, radioVolume]
  );

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

  const [isScheduleTriggered, updateScheduleTriggered] = useState(false);
  const [isEventScheduleVisible, setEventScheduleVisible] = useState(false);

  const toggleEventSchedule = useCallback(() => {
    if (!isScheduleTriggered && isEventScheduleVisible) {
      updateScheduleTriggered(true);
    }
    setEventScheduleVisible(!isEventScheduleVisible);
  }, [isEventScheduleVisible, isScheduleTriggered]);

  const scheduleBtnClasses = classNames("nav-schedule", {
    "nav-schedule-clicked": isEventScheduleVisible,
    "nav-schedule-triggered": isScheduleTriggered && !isEventScheduleVisible,
  });

  const navBarScheduleClassName = "NavBar__schedule-dropdown";

  const scheduleArrowClasses = classNames({
    "arrow-up": isEventScheduleVisible,
    "arrow-down": !isEventScheduleVisible,
  });

  const dropdownArrowClasses = classNames({
    "arrow-up": isDropdownShown,
    "arrow-down": !isDropdownShown,
  });

  const hideEventSchedule = useCallback((e) => {
    if (
      e.target.closest(`.${navBarScheduleClassName}`) ||
      e.target.closest(`.modal`)
    )
      return;

    setEventScheduleVisible(false);
  }, []);

  const navigateToHomepage = useCallback(() => {
    enterVenue(BM_PARENT_ID, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [openUrlUsingRouter]);

  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  const onInputFocus = useCallback(() => setIsFocus(true), []);

  const onInputBlur = useCallback(() => {
    setIsFocus(false);
    toggleSearchShown();
  }, [toggleSearchShown]);

  const onMouseLeave = useCallback(() => {
    if (isFocus) return;
    toggleSearchShown();
  }, [isFocus, toggleSearchShown]);

  if (!ALLOW_NO_VENUE && !(venueId && currentVenue)) {
    console.warn(
      NavBar.name,
      `aborted display because of missing id (${venueId}) or venue (${currentVenue})`
    );
    return null;
  }

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? currentVenue?.name;

  const radioStation = hasRadioStations(radioStations) && radioStations[0];

  const showNormalRadio = (currentVenue?.showRadio && !isSoundCloud) ?? false;
  const showSoundCloudRadio =
    (currentVenue?.showRadio && isSoundCloud) ?? false;

  const showRadio = showNormalRadio || showSoundCloudRadio;

  return (
    <>
      <header>
        <div className={`navbar navbar_playa ${!isOnPlaya && "nonplaya"}`}>
          <div className="navbar-container">
            <div className="nav-logos">
              {/* Disabled caret back button on navBar */}
              {/* {shouldShowHomeButton && (
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className="NavBar__home-icon"
                  onClick={navigateToHomepage}
                />
              )} */}
              <div className="nav-sparkle-logo">
                <div onClick={navigateToHomepage}></div>
              </div>
              <div
                className="NavBar__nav-clickable"
                onClick={toggleEventSchedule}
              >
                <p className="NavBar__venue-id">{venueId}</p>
                {shouldShowSchedule ? (
                  <div className="nav-schedule-wrapper">
                    <ButtonNG
                      aria-label="Schedule"
                      className={scheduleBtnClasses}
                      onClick={toggleEventSchedule}
                    >
                      What&apos;s On
                    </ButtonNG>
                  </div>
                ) : (
                  <div>{navbarTitle}</div>
                )}
                <div className={scheduleArrowClasses}></div>
              </div>
              <div
                className="NavBar__photobooth-button nav-schedule"
                onClick={() => openUrlInNewTab(SPARKLEVERSE_PHOTOBOOTH_URL)}
              >
                <p className="NavBar__photobooth-title">Photobooth</p>
              </div>

              <div className="navbar-links__simple-view">
                <a
                  className="navbar-links__simple-view-a"
                  href={`/m/${venueId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ButtonNG className="navbar-links__simple-view-button">
                    <FontAwesomeIcon icon={faEye} />
                    <span className="navbar-links__simple-view-text">
                      &nbsp; Simple View
                    </span>
                  </ButtonNG>
                </a>
              </div>
            </div>

            {!user && <NavBarLogin />}

            {user && (
              <div className="navbar-links">
                <div className="NavBar__playa-info">
                  <VenuePartygoers />
                </div>

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

                {IS_BURN && currentVenue?.showGiftATicket && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={GiftPopover}
                    rootClose={true}
                  >
                    <span className="private-chat-icon">
                      <div className="navbar-link-gift" />
                    </span>
                  </OverlayTrigger>
                )}

                <div
                  className="NavBar__search"
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
                    className="NavBar__menu-link"
                    iconOnly
                    iconSize="1x"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </ButtonNG>
                </div>

                <ButtonNG className="NavBar__menu-link" iconOnly iconSize="1x">
                  <img src={RadioIcon} alt="radio icon" />
                </ButtonNG>

                {showRadio && (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={
                      <Popover id="radio-popover">
                        <Popover.Content className="NavBar__radio-container">
                          <RadioPopoverContent
                            radioTitle={
                              currentVenue?.radioTitle ?? "Playa Radio"
                            }
                            showNormalRadio={showNormalRadio}
                            showSoundCloudRadio={showSoundCloudRadio}
                            radioStation={radioStation}
                            isRadioPlaying={isRadioPlaying}
                            handleRadioEnable={handleRadioEnable}
                            volume={radioVolume}
                            setVolume={setRadioVolume}
                            onMute={toggleMute}
                          />
                        </Popover.Content>
                      </Popover>
                    }
                    rootClose={true}
                    defaultShow={showRadioOverlay}
                  >
                    <ButtonNG
                      className="NavBar__menu-link"
                      iconOnly
                      iconSize="1x"
                    >
                      <img src={RadioIcon} alt="radio icon" />
                    </ButtonNG>
                  </OverlayTrigger>
                )}

                {IS_SIMPLE_MUTE_BUTTON ? (
                  <VolumeControl
                    className="NavBar__volume-control"
                    name="noise"
                    muted={isAmbientAudioVocal}
                    withMute
                    onMute={onToggleAmbientAudio}
                  />
                ) : (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom-end"
                    overlay={VolumePopover}
                    rootClose={true}
                  >
                    <button className="NavBar__menu-link">
                      <FontAwesomeIcon icon={faVolumeUp} />
                    </button>
                  </OverlayTrigger>
                )}
                <div
                  className="navbar-links-user-avatar"
                  onClick={toggleDropdownShown}
                >
                  <UserAvatar
                    user={userWithId}
                    showStatus
                    containerClassName="NavBar__user-avatar"
                    size="small"
                  />
                  <div className={dropdownArrowClasses}></div>
                </div>
                {isDropdownShown && (
                  <Dropdown className="NavBar__dropdown">
                    <Dropdown.Item className="NavBar__dropdown-item" disabled>
                      Hello {profile?.partyName}
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="NavBar__dropdown-item"
                      onClick={handleAvatarClick}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="NavBar__dropdown-item-icon"
                      />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item className="NavBar__dropdown-item">
                      <FontAwesomeIcon
                        icon={faCog}
                        className="NavBar__dropdown-item-icon"
                      />
                      Account
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="NavBar__dropdown-item"
                      href={HELP_CENTER_URL}
                      {...getExtraLinkProps(true)}
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="NavBar__dropdown-item-icon"
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
              venueId={venueId ?? ""}
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
