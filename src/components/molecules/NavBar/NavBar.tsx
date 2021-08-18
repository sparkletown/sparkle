import React, { useState, useMemo, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Popover } from "react-bootstrap";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicketAlt,
  faBars,
  faVolumeUp,
  faVolumeMute,
  faCaretLeft,
  faBroadcastTower,
} from "@fortawesome/free-solid-svg-icons";

import firebase from "firebase/app";

import { DEFAULT_SHOW_SCHEDULE, PLAYA_VENUE_ID } from "settings";
import { IS_BURN } from "secrets";

import { UpcomingEvent } from "types/UpcomingEvent";

import { radioStationsSelector } from "utils/selectors";

import { hasElements } from "utils/types";
import { enterVenue, venueInsideUrl } from "utils/url";

import { useRadio } from "hooks/useRadio";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { GiftTicketModal } from "components/organisms/GiftTicketModal/GiftTicketModal";
import { ProfilePopoverContent } from "components/organisms/ProfileModal";
import { NavBarSchedule } from "components/organisms/NavBarSchedule/NavBarSchedule";

import { NavSearchBar } from "components/molecules/NavSearchBar";
import UpcomingTickets from "components/molecules/UpcomingTickets";
import { VenuePartygoers } from "components/molecules/VenuePartygoers";
import { MenuPopoverContent } from "components/molecules/MenuPopoverContent";
import { RadioPopoverContent } from "components/molecules/RadioPopoverContent";
import PlayaTime from "components/molecules/PlayaTime";

import { UserAvatar } from "components/atoms/UserAvatar";

import { NavBarLogin } from "./NavBarLogin";

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

const ProfilePopover = (
  <Popover id="profile-popover">
    <Popover.Content className="NavBar__profile-popover">
      <ProfilePopoverContent />
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

export const NavBar: React.FC = () => {
  const { user, userWithId } = useUser();
  const venueId = useVenueId();

  const radioStations = useSelector(radioStationsSelector);

  const { currentVenue, parentVenue, sovereignVenueId } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const {
    location: { pathname },
    push: openUrlUsingRouter,
  } = useHistory();

  const isSovereignVenue = venueId === sovereignVenueId;

  const hasSovereignVenue = sovereignVenueId !== undefined;

  const shouldShowHomeButton = hasSovereignVenue && !isSovereignVenue;

  const shouldShowSchedule =
    currentVenue?.showSchedule ?? DEFAULT_SHOW_SCHEDULE;

  const isOnPlaya = pathname.toLowerCase() === venueInsideUrl(PLAYA_VENUE_ID);

  const now = firebase.firestore.Timestamp.fromDate(new Date());
  const futureUpcoming =
    currentVenue?.events?.filter((e) => e.ts_utc.valueOf() > now.valueOf()) ??
    []; //@debt typing does this exist?

  const hasUpcomingEvents = futureUpcoming && futureUpcoming.length > 0;

  const hasRadioStations = radioStations && radioStations.length;
  const isSoundCloud =
    !!hasRadioStations && RegExp("soundcloud").test(radioStations![0]);

  const sound = useMemo(
    () =>
      radioStations && hasElements(radioStations) && !isSoundCloud
        ? new Audio(radioStations[0])
        : undefined,
    [isSoundCloud, radioStations]
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
  const isMute = !Boolean(volume);

  const volumeControlClassname = classNames(
    "NavBar__menu--icon NavBar__menu--volume",
    {
      mute: isMute,
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

  const navigateToHomepage = useCallback(() => {
    if (!sovereignVenueId) return;

    enterVenue(sovereignVenueId, { customOpenRelativeUrl: openUrlUsingRouter });
  }, [sovereignVenueId, openUrlUsingRouter]);

  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  if (!venueId || !currentVenue) return null;

  // TODO: ideally this would find the top most parent of parents and use those details
  const navbarTitle = parentVenue?.name ?? currentVenue.name;

  const radioStation = !!hasRadioStations && radioStations![0];

  const showNormalRadio = (currentVenue?.showRadio && !isSoundCloud) ?? false;
  const showSoundCloudRadio =
    (currentVenue?.showRadio && isSoundCloud) ?? false;
  const showRadio = showNormalRadio || showSoundCloudRadio;
  const volumeIcon = isMute ? faVolumeMute : faVolumeUp;

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
                    <button className="NavBar__menu--icon">
                      <FontAwesomeIcon
                        // TODO: fix with a new icon
                        icon={faBroadcastTower}
                        size="sm"
                      />
                    </button>
                  </OverlayTrigger>
                )}

                {showRadio && (
                  <button
                    className={volumeControlClassname}
                    onClick={toggleMute}
                  >
                    <FontAwesomeIcon icon={volumeIcon} size="sm" />
                  </button>
                )}
                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={ProfilePopover}
                  rootClose={true}
                >
                  <UserAvatar
                    user={userWithId}
                    showStatus
                    containerClassName="NavBar__userAvatar"
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom-end"
                  overlay={MenuPopover}
                  rootClose={true}
                >
                  <button className="NavBar__menu--icon">
                    <FontAwesomeIcon icon={faBars} size="sm" />
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
    </>
  );
};
