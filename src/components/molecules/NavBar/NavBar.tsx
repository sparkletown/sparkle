import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  faBars,
  faCaretLeft,
  faTicketAlt,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import firebase from "firebase/app";
import { isEmpty } from "lodash";

import { IS_BURN } from "secrets";

import { DEFAULT_SHOW_SCHEDULE, PLAYA_VENUE_ID } from "settings";

import { UpcomingEvent } from "types/UpcomingEvent";

import { radioStationsSelector } from "utils/selectors";
import { enterVenue, venueInsideUrl } from "utils/url";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useRadio } from "hooks/useRadio";
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

import { BackButton } from "components/atoms/BackButton";
import { UserAvatar } from "components/atoms/UserAvatar";

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

const navBarScheduleClassName = "NavBar__schedule-dropdown";

export interface NavBarPropsType {
  hasBackButton?: boolean;
}

export const NavBar: React.FC<NavBarPropsType> = ({ hasBackButton = true }) => {
  const { user, userWithId } = useUser();
  const venueId = useVenueId();

  const radioStations = useSelector(radioStationsSelector);

  const { currentVenue, parentVenue, sovereignVenueId } = useRelatedVenues({
    currentVenueId: venueId,
  });
  const parentVenueId = parentVenue?.id;

  const {
    location: { pathname },
    push: openUrlUsingRouter,
  } = useHistory();

  const isSovereignVenue = venueId === sovereignVenueId;

  const hasSovereignVenue = sovereignVenueId !== undefined;

  const shouldShowHomeButton = hasSovereignVenue && !isSovereignVenue;

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
    currentVenue?.showSchedule ?? DEFAULT_SHOW_SCHEDULE;

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
  const handleMute = useCallback(
    (volume: number) => (volume !== 0 ? 0 : 100),
    []
  );
  const toggleMute = useCallback(() => setVolume(handleMute), [
    handleMute,
    setVolume,
  ]);

  const volumeControlClassname = classNames(
    "NavBar__menu--link NavBar__menu--volume",
    {
      mute: !volume,
    }
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

  const backToParentVenue = useCallback(() => {
    if (!parentVenueId) return;

    enterVenue(parentVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [parentVenueId, openUrlUsingRouter]);

  const navigateToHomepage = useCallback(() => {
    if (!sovereignVenueId) return;

    enterVenue(sovereignVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [sovereignVenueId, openUrlUsingRouter]);

  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  if (!venueId || !currentVenue) return null;

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? currentVenue.name;

  const radioStation = hasRadioStations(radioStations) && radioStations[0];

  const showNormalRadio = (currentVenue?.showRadio && !isSoundCloud) ?? false;
  const showSoundCloudRadio =
    (currentVenue?.showRadio && isSoundCloud) ?? false;

  const showRadio = showNormalRadio || showSoundCloudRadio;
  const volumeIcon = !volume ? faVolumeMute : faVolumeUp;

  return (
    <>
      <header>
        <div className={`navbar navbar_playa ${!isOnPlaya && "nonplaya"}`}>
          <div className="navbar-container">
            <div className="nav-logos">
              {shouldShowHomeButton && (
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className="NavBar__home--icon"
                  onClick={navigateToHomepage}
                />
              )}
              <div className="nav-sparkle-logo" onClick={navigateToHomepage} />
              {shouldShowSchedule ? (
                <button
                  aria-label="Schedule"
                  className={`nav-party-logo ${
                    isEventScheduleVisible && "clicked"
                  }`}
                  onClick={toggleEventSchedule}
                >
                  {navbarTitle} <span className="schedule-text">Schedule</span>
                </button>
              ) : (
                <div>{navbarTitle}</div>
              )}
              <PlayaTime /> - <VenuePartygoers venueId={venueId} />
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
                        <Popover.Content className="NavBar__radio--container">
                          <RadioPopoverContent
                            radioTitle={
                              currentVenue?.radioTitle ?? "Playa Radio"
                            }
                            showNormalRadio={showNormalRadio}
                            showSoundCloudRadio={showSoundCloudRadio}
                            radioStation={radioStation}
                            isRadioPlaying={isRadioPlaying}
                            handleRadioEnable={handleRadioEnable}
                            volume={volume}
                            setVolume={setVolume}
                          />
                        </Popover.Content>
                      </Popover>
                    }
                    rootClose={true}
                    defaultShow={showRadioOverlay}
                  >
                    <button className="NavBar__menu--link">
                      <img
                        className="NavBar__link--icon"
                        src={RadioIcon}
                        alt="radio icon"
                      />
                    </button>
                  </OverlayTrigger>
                )}

                {showRadio && (
                  <button
                    className={volumeControlClassname}
                    onClick={toggleMute}
                  >
                    <FontAwesomeIcon icon={volumeIcon} />
                  </button>
                )}
                <div
                  className="navbar-links-user-avatar"
                  onClick={handleAvatarClick}
                >
                  <UserAvatar
                    user={userWithId}
                    showStatus
                    size="medium"
                    containerClassName="NavBar__userAvatar"
                  />
                </div>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={MenuPopover}
                  rootClose={true}
                >
                  <button className="NavBar__menu--link">
                    <FontAwesomeIcon icon={faBars} />
                  </button>
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
