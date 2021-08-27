import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";
import {
  faBars,
  faTicketAlt,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import firebase from "firebase/app";
import { isEmpty } from "lodash";

import { IS_BURN } from "secrets";

import {
  BM_PARENT_ID,
  DEFAULT_AMBIENT_VOLUME,
  DEFAULT_SHOW_SCHEDULE,
  IS_SIMPLE_MUTE_BUTTON,
  LS_KEY_IS_AMBIENT_AUDIO_VOCAL,
  LS_KEY_RADIO_VOLUME,
  PLAYA_VENUE_ID,
} from "settings";

import { setAnimateMapEnvironmentSound } from "store/actions/AnimateMap";

import { UpcomingEvent } from "types/UpcomingEvent";

import {
  animateMapEnvironmentSoundSelector,
  radioStationsSelector,
} from "utils/selectors";
import { enterVenue, venueInsideUrl } from "utils/url";

import { useAudioVolume } from "hooks/useAudioVolume";
import { useDispatch } from "hooks/useDispatch";
import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { GiftTicketModal } from "components/organisms/GiftTicketModal/GiftTicketModal";
import { NavBarSchedule } from "components/organisms/NavBarSchedule/NavBarSchedule";

import { MenuPopoverContent } from "components/molecules/MenuPopoverContent";
import { NavSearchBar } from "components/molecules/NavSearchBar";
import { PlayaTime } from "components/molecules/PlayaTime";
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

const MenuPopover = (
  <Popover id="menu-popover">
    <Popover.Content>
      <MenuPopoverContent />
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

const navBarScheduleClassName = "NavBar__schedule-dropdown";
export interface NavBarPropsType {
  hasBackButton?: boolean;
  hasSchedule?: boolean;
}

export const NavBar: React.FC<NavBarPropsType> = ({
  hasBackButton = true,
  hasSchedule = true,
}) => {
  const { user, userWithId } = useUser();
  const venueId = useVenueId();

  const radioStations = useSelector(radioStationsSelector);

  const { currentVenue, parentVenue } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const {
    location: { pathname },
    push: openUrlUsingRouter,
  } = useHistory();

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

  const shouldShowSchedule = !hasSchedule
    ? false
    : currentVenue?.showSchedule ?? DEFAULT_SHOW_SCHEDULE;

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
    "nav-schedule-marged": hasBackButton,
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

  if (!venueId || !currentVenue) return null;

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? currentVenue.name;

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
              <div
                className="NavBar__sparkle-logo"
                onClick={navigateToHomepage}
              />
              {shouldShowSchedule ? (
                <div
                  aria-label="Schedule"
                  className={scheduleBtnClasses}
                  onClick={toggleEventSchedule}
                ></div>
              ) : (
                <div>{navbarTitle}</div>
              )}
              <PlayaTime />
              <div className="NavBar__separator">-</div>
              <VenuePartygoers />
            </div>

            {!user && <NavBarLogin />}

            {user && (
              <div className="navbar-links">
                <NavSearchBar venueId={venueId} />

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
                  onClick={handleAvatarClick}
                >
                  <UserAvatar
                    user={userWithId}
                    showStatus
                    containerClassName="NavBar__user-avatar"
                    size="small"
                  />
                </div>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={MenuPopover}
                  rootClose={true}
                >
                  <ButtonNG
                    className="NavBar__menu--link NavBar__menu-icon"
                    iconOnly
                    iconSize="1x"
                    iconName={faBars}
                  />
                </OverlayTrigger>
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
